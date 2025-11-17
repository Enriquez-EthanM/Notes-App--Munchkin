import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotesPage from './pages/NotesPage';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Trash from './pages/Trash';
import logo from './assets/munchkin.png';
import SHA256 from 'crypto-js/sha256';
import * as Cardano from "@emurgo/cardano-serialization-lib-browser";

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [dark, setDark] = useState(false);
  const [wallet, setWallet] = useState(null);

  const hashNote = note => SHA256(note.title + note.content).toString();
  
  const BLOCKFROST_PROJECT_ID = "previewBNBSMPO3m9k0fm4nSMKuToSR6E3UtIXU";

  // Dark mode toggle
  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}



  // Connect wallet
  const connectWallet = async () => {
    if (!window.cardano || !window.cardano.lace) {
      alert("Please install Lace wallet!");
      return;
    }
    try {
      const w = await window.cardano.lace.enable();
      console.log("Wallet object methods:", w);
      setWallet(w);

      const address = await w.getChangeAddress(); // Fetch user's wallet address
      console.log("Wallet connected. Address:", address);

      localStorage.setItem("walletConnected", "true"); // Mark wallet as connected
    } catch (err) {
      console.error("Wallet connection failed:", err);
      localStorage.removeItem("walletConnected"); // Clear flag on failure
    }
  };

  // Auto-reconnect wallet on page reload
  useEffect(() => {
    const autoReconnect = async () => {
      const savedConnection = localStorage.getItem("walletConnected");
      if (savedConnection === "true" && window.cardano && window.cardano.lace) {
        try {
          const w = await window.cardano.lace.enable();
          setWallet(w);

          const address = await w.getChangeAddress();
          console.log("Wallet auto-reconnected. Address:", address);
        } catch (err) {
          console.error("Auto-reconnect failed:", err);
          localStorage.removeItem("walletConnected"); // Clear connection flag if reconnection fails
        }
      }
    };
    autoReconnect();
  }, []);

  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem("walletConnected"); // Clear connection flag on disconnect
    console.log("Wallet disconnected.");
  };

  const buildNoteMetadata = (note, action) => {
  if (!note || !note.title || !note.content) {
    console.error("Invalid note object provided to buildNoteMetadata:", note);
    throw new Error("Invalid note object");
  }

  const metadata = {
    674: {
      noteId: note.id || '',
      action: action || 'UNKNOWN',
      hash: hashNote(note),
      timestamp: Date.now(),
    },
  };

  console.log("Generated Note Metadata:", metadata);
  return metadata;
};

  const submitTxToBlockfrost = async signedTx => {
    const response = await fetch(
      "https://cardano-preview.blockfrost.io/api/v0/tx/submit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/cbor",
          "project_id": BLOCKFROST_PROJECT_ID,
        },
        body: hexToBytes(signedTx),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error submitting transaction: ${response.status} ${text}`);
    }

    return await response.text(); // Returns txHash
  };

  const addNote = async note => {
  console.log("[addNote] Function called with note:", note);
  const now = Date.now();
  const newNote = {
    id: now,
    ...note,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    favorite: !!note.favorite,
  };

  try {
    console.log("[addNote] Building metadata...");
    const metadata = buildNoteMetadata(newNote, "CREATE");

    console.log("[addNote] Preparing to call sendNoteTransaction...");
    const txHash = await sendNoteTransaction(newNote, metadata);
    console.log("CREATE transaction hash:", txHash);

    // Add note to backend/database
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newNote, txHash }),
    });

    // Update state with new note
    setNotes([newNote, ...notes]);
  } catch (err) {
    console.error("Failed to add note:", err);
  }
};

  const sendNoteTransaction = async (note, metadataObj) => {
  if (!wallet) throw new Error("Wallet not connected");

  if (!metadataObj || !metadataObj[674]) {
    console.error("Invalid metadata object:", metadataObj);
    throw new Error("Invalid metadata object for key 674");
  }

  // 1. Fetch UTXOs
  const utxosHex = await wallet.getUtxos();
  const utxos = utxosHex.map(u =>
    Cardano.TransactionUnspentOutput.from_bytes(hexToBytes(u, "hex"))
  );

  // 2. Get change address
  const changeAddress = Cardano.Address.from_bytes(
    hexToBytes(await wallet.getChangeAddress(), "hex")
  );

  // 3. Build metadata
  const metadata = Cardano.GeneralTransactionMetadata.new();
  metadata.insert(
    Cardano.BigNum.from_str("674"),
    Cardano.encode_json_str_to_metadatum(JSON.stringify(metadataObj[674]), 0)
  );

  const auxData = Cardano.AuxiliaryData.new();
  auxData.set_metadata(metadata);

  // 4. Build transaction configuration
  const configBuilder = Cardano.TransactionBuilderConfigBuilder.new();
  configBuilder.fee_algo(Cardano.LinearFee.new(
    Cardano.BigNum.from_str("44"),
    Cardano.BigNum.from_str("155381")
  ));
  configBuilder.coins_per_utxo_word(Cardano.BigNum.from_str("34482")); // Adjust based on library version
  configBuilder.key_deposit(Cardano.BigNum.from_str("2000000"));
  configBuilder.pool_deposit(Cardano.BigNum.from_str("500000000"));
  configBuilder.max_value_size(5000);
  configBuilder.max_tx_size(16384);

  const txConfig = configBuilder.build(); // Build final configuration

  let txBuilder = Cardano.TransactionBuilder.new(txConfig);

  // 5. Add UTXOs as inputs
  utxos.forEach(u => {
    txBuilder.add_input(
      u.output().address(),
      u.input(),
      u.output().amount()
    );
  });

  // 6. Set output = change
  txBuilder.add_output(
    Cardano.TransactionOutput.new(
      changeAddress,
      Cardano.Value.new(Cardano.BigNum.from_str("1000000"))
    )
  );

  txBuilder.set_auxiliary_data(auxData);

  // 7. Calculate change
  txBuilder.add_change_if_needed(changeAddress);

  const unsignedTx = txBuilder.build_tx();

  // 8. SIGN WITH WALLET
  const signedTxHex = await wallet.signTx(
    Buffer.from(unsignedTx.to_bytes(), "hex").toString("hex"),
    true
  );

  // 9. SUBMIT TO BLOCKFROST
  const txHash = await submitTxToBlockfrost(Buffer.from(signedTxHex, "hex"));
  return txHash;
};


  // Note CRUD Operations
  

  const counts = useMemo(
    () => ({
      total: notes.filter(note => !note.deletedAt).length,
      favorites: notes.filter(note => note.favorite && !note.deletedAt).length,
      deleted: notes.filter(note => note.deletedAt).length,
    }),
    [notes]
  );

  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", fontFamily: "Segoe UI, Arial, sans-serif" }}>
        <header style={{ display: "flex", alignItems: "center", padding: "1rem", gap: "1rem" }}>
          <img src={logo} alt="Logo" style={{ width: 40, height: 40 }} />
          <h1>Munchkin Notes</h1>
          <div>
            {wallet ? (
              <>
                <button onClick={disconnectWallet}>Disconnect Wallet</button>
                <span style={{ marginLeft: "1rem" }}>Wallet Connected</span>
              </>
            ) : (
              <button onClick={connectWallet}>Connect Lace Wallet</button>
            )}
          </div>
        </header>
        <Navbar dark={dark} toggleDark={() => setDark(!dark)} />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard notes={notes} />} />
            <Route
              path="/notes"
              element={<NotesPage notes={notes} addNote={addNote} />}
            />
            <Route path="/favorites" element={<Favorites notes={notes} />} />
            <Route path="/trash" element={<Trash notes={notes} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;