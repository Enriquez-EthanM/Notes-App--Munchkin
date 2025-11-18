import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import React, { useEffect, useMemo, useState } from "react";
import logo from "./assets/munchkin.png";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import Trash from "./pages/Trash";
import { Blaze, Blockfrost, Core, WebWallet } from "@blaze-cardano/sdk";

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [dark, setDark] = useState(false);

  // Cardano wallet states
  const [wallets, setWallets] = useState([]);
  const [walletApi, setWalletApi] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0n);

  const provider = new Blockfrost({
    network: 'cardano-preview',
    projectId: import.meta.env.VITE_BLOCKFROST_PROJECT_ID,
  });

  // Dark mode toggle
  useEffect(() => {
    if (dark) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [dark]);

  // Load available Cardano wallets
  useEffect(() => {
    if(window.cardano){
      setWallets(Object.keys(window.cardano))
    }
  }, []);

  // Cardano wallet handlers
  const handleWalletChange = async (event) => {
    const walletName = event.target.value;
    setSelectedWallet(walletName);
  };

  const handleSubmitTransaction = async () => {
    if (walletApi) { 
      try {
        const wallet = new WebWallet(walletApi);
        const blaze = await Blaze.from(provider, wallet);
        console.log('Blaze instance created', blaze);

        const bech32Address = Core.Address.fromBytes(Buffer.from(walletAddress, 'hex')).toBech32();
        console.log('Recipient Bech32 Address:', bech32Address);

        const tx = await blaze
          .newTransaction()
          .payLovelace(Core.Address.fromBech32(recipient), amount)
          .complete();
          console.log('Transaction built: ', tx.toCbor());
          const signedTx = await blaze.signTransaction(tx);
          console.log('Transaction signed: ', signedTx.toCbor());
          const txHash = await blaze.provider.postTransactionToChain(signedTx);
          console.log('Transaction submitted with hash:', txHash);
      } catch (error) {
        console.error('Error creating transaction:', error);
      }
    }
  }

  const handleConnectWallet = async () => {
    console.log('Connecting to wallet:', window.cardano[selectedWallet]);
    if (selectedWallet && window.cardano[selectedWallet]) {
      try {
        const api = await window.cardano[selectedWallet].enable();
        setWalletApi(api);
        console.log('Connected to wallet API:', api);

        const address = await api.getChangeAddress();
        console.log('Wallet address:', address);
        setWalletAddress(address);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      } 
    }
  };

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  }

  const handleAmountChange = (event) => {
    setAmount(BigInt(event.target.value));
  }

  // Notes management functions
  const addNote = (note) => {
    const now = Date.now();
    const newNote = { id: now, createdAt: now, updatedAt: now, favorite: !!note.favorite, deletedAt: null, ...note };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (editingNote && editingNote.id === id) setEditingNote(null);
  };

  const confirmDelete = (id) => {
    const ok = window.confirm("Move note to Recently Deleted?");
    if (!ok) return;
    setNotes(notes.map((n) => (n.id === id ? { ...n, deletedAt: Date.now() } : n)));
    if (editingNote && editingNote.id === id) setEditingNote(null);
  };

  const purgeNote = (id) => {
    const ok = window.confirm("Delete forever? This cannot be undone.");
    if (!ok) return;
    setNotes(notes.filter((n) => n.id !== id));
  };

  const restoreNote = (id) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, deletedAt: null } : n)));
  };

  const startEditNote = (note) => {
    setEditingNote(note);
  };

  const updateNote = (updatedNote) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? { ...updatedNote, updatedAt: Date.now() } : note)));
    setEditingNote(null);
  };

  const toggleFavorite = (id) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n)));
  };

  const counts = useMemo(
    () => ({
      total: notes.filter((n) => !n.deletedAt).length,
      favorites: notes.filter((n) => n.favorite && !n.deletedAt).length,
      deleted: notes.filter((n) => !!n.deletedAt).length,
    }),
    [notes]
  );

  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: dark ? "linear-gradient(135deg, #0b1220 0%, #0f172a 40%, #111827 100%)" : "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 30%, #fdf2f8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Segoe UI, Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1200,
            minHeight: 600,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 28,
            boxShadow: "0 20px 60px rgba(99,102,241,0.18)",
            padding: "2rem 2rem 2.2rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            backdropFilter: "blur(8px)",
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <img src={logo} alt="NoteApp Logo" style={{ width: 40, height: 40 }} />
              <h1 style={{ fontWeight: 800, fontSize: "1.8rem", color: "#6366f1", margin: 0 }}>Munchkin Notes</h1>
            </div>

            {/* CARDANO WALLET */}
            <div>
              <select value={selectedWallet} onChange={handleWalletChange} style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #c7d2fe",         
                background: "rgba(255,255,255,0.9)", 
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                outline: "none",
                color: "#1e293b",
                boxShadow: "0 4px 10px rgba(99,102,241,0.1)",
                transition: "0.2s ease-in-out",
                appearance: "none",                
                WebkitAppearance: "none",
                MozAppearance: "none",
                paddingRight: "40px",               
                position: "relative",
              }}>
                <option value="" disabled selected>Select Wallet</option>
                {wallets.length > 0 && wallets.map((wallet) => (
                  <option key={wallet} value={wallet}>{wallet}</option>
                ))}
              </select>

              <button
                onClick={handleConnectWallet}
                disabled={!!walletApi}
                style={{
                  background: "#6366f1",
                  color: "white",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 10px rgba(99,102,241,0.2)",
                  opacity: !!walletApi ? 0.6 : 1, 
                }}
              >
                {walletApi ? "Wallet Connected" : "Connect Wallet"}
              </button>

            </div>
          </header>
          <div style={{ width: "100%", marginBottom: "1rem" }}>
            <div style={{ width: "100%", marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#475569", wordBreak: "break-all" }}>
                <strong style={{ color: "#111827", fontWeight: 700 }}>Connected Wallet:</strong>
                <span style={{ marginLeft: 8, display: "inline-block", maxWidth: 920 }}>{walletAddress || "Not connected"}</span>
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <label style={{ display: "flex", flexDirection: "column", fontSize: "0.9rem", color: "#475569" }}>
                <span style={{ marginBottom: 6 }}>Recipient Address</span>
                <input
                  type="text"
                  placeholder="Enter recipient address"
                  value={recipient}
                  onChange={handleRecipientChange}
                  style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #c7d2fe",
                      background: "rgba(255,255,255,0.95)",
                      fontSize: "0.95rem",
                      minWidth: 320,
                      boxShadow: "0 4px 10px rgba(99,102,241,0.06)",
                      color: dark ? "#ffffff" : "#0f172a",
                    }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", fontSize: "0.9rem", color: "#475569" }}>
                <span style={{ marginBottom: 6 }}>Amount</span>
                <input
                  type="number"
                  placeholder="Enter amount in ADA"
                  value={amount}
                  onChange={handleAmountChange}
                  style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #c7d2fe",
                      background: "rgba(255,255,255,0.95)",
                      fontSize: "0.95rem",
                      width: 140,
                      boxShadow: "0 4px 10px rgba(99,102,241,0.06)",
                      color: dark ? "#ffffff" : "#0f172a",
                    }}
                />
              </label>

              <button
                onClick={handleSubmitTransaction}
                style={{
                  background: "#6366f1",
                  color: "white",
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  boxShadow: "0 6px 18px rgba(99,102,241,0.18)",
                  marginLeft: 4,
                }}
              >
                Send
              </button>
            </div>
          </div>
          
          <Navbar dark={dark} toggleDark={() => setDark(!dark)} />

          <main style={{ width: "100%", marginTop: "6px" }}>
            <Routes>
              <Route path="/" element={<Dashboard notes={notes} />} />
              <Route
                path="/notes"
                element={
                  <NotesPage
                    notes={notes.filter((n) => !n.deletedAt)}
                    addNote={addNote}
                    deleteNote={deleteNote}
                    editingNote={editingNote}
                    startEditNote={startEditNote}
                    updateNote={updateNote}
                    toggleFavorite={toggleFavorite}
                    confirmDelete={confirmDelete}
                  />
                }
              />
              <Route path="/favorites" element={<Favorites notes={notes} deleteNote={deleteNote} startEditNote={startEditNote} toggleFavorite={toggleFavorite} />} />
              <Route path="/trash" element={<Trash notes={notes} restoreNote={restoreNote} purgeNote={purgeNote} />} />
            </Routes>
          </main>

          <footer style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "1.5rem", textAlign: "center" }}>
            &copy; {new Date().getFullYear()} Munchkin Notes. All rights reserved. Jv Gwapo
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
