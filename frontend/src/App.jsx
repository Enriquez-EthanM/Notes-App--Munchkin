import { Blaze, Blockfrost, Core, WebWallet } from '@blaze-cardano/sdk';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import React, { useEffect, useMemo, useState } from 'react';
import logo from './assets/munchkin.png';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Trash from './pages/Trash';
import { getNotes, createNote as createNoteAPI, updateNote as updateNoteAPI, deleteNote as deleteNoteAPI } from './service/notesServices';
import { toggleFavorite as toggleFavoriteAPI } from './service/favoriteServices';
import { moveToTrash, restoreFromTrash, permanentlyDelete, getTrashedNotes } from './service/trashServices';

function App() {
  const [notes, setNotes] = useState([]);
  const [trashedNotes, setTrashedNotes] = useState([]);
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

  // Load notes from backend
  useEffect(() => {
    loadNotes();
    loadTrashedNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const loadTrashedNotes = async () => {
    try {
      const data = await getTrashedNotes();
      setTrashedNotes(data);
    } catch (error) {
      console.error('Failed to load trashed notes:', error);
    }
  };

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
    if (walletApi && editingNote) { 
      try {
        const wallet = new WebWallet(walletApi);
        const blaze = await Blaze.from(provider, wallet);
        console.log('Blaze instance created', blaze);

        const bech32Address = Core.Address.fromBytes(Buffer.from(walletAddress, 'hex')).toBech32();
        console.log('Recipient Bech32 Address:', bech32Address);

        const tx = await blaze
          .newTransaction()
          .payLovelace(Core.Address.fromBech32(recipient), amount);
        
        const metadata = new Map();
        const label = 91975n
        const metadatumMap = new Core.MetadatumMap();

        const action = 'create_note';
        const noteContent = editingNote.content;
        const formattedContent = formatContent(noteContent || "")

        metadatumMap.insert(
          Core.Metadatum.newText("action"),
          Core.Metadatum.newText(action)
        );

        metadatumMap.insert(
          Core.Metadatum.newText("note_title"),
          Core.Metadatum.newText(editingNote.title)
        );

        metadatumMap.insert(
          Core.Metadatum.newText("note"),
          formattedNoteContent
        );

        // is this the note id???
        metadatumMap.insert(
          Core.Metadatum.newText("note_id"),
          Core.Metadatum.newText(String(editingNote.id))
        );

        metadatumMap.insert(
          Core.Metadatum.newText("created_at"),
          Core.Metadatum.newText(new Date().toISOString())
        );

        const metadatum = Core.Metadatum.newMap(metadatumMap);
        metadata.set(label, metadatum);
        const finalMetadata = new Core.Metadata(metadata);

        tx.setMetadata(finalMetadata);

        console.log('Metadata inserted: ', formatContent(finalMetadata || ""));

        const completedTx = await tx.complete();

        console.log('Transaction built: ', tx.toCbor());

        const signedTx = await blaze.signTransaction(tx);

        console.log('Transaction signed: ', signedTx.toCbor());

        const txHash = await blaze.provider.postTransactionToChain(signedTx);

        console.log('Transaction submitted with hash:', txHash);
      } catch (error) {
        console.error('Error creating transaction:', error);
      } else {
        console.error('No wallet connected or note selected');
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

  // HELPER FUNCTION: FORMAT CONTENT
  // PURPOSE: CARDANO METADATA STRINGS CANNOT EXCEED 64 BYTES.
  // THIS FUNCTION CHECKS THE LENGTH. IF IT IS SHORT, IT RETURNS A SIMPLE TEXT.
  // IF IT IS LONG, IT SPLITS THE TEXT INTO CHUNKS AND RETURNS A LIST.

  const formatContent = (content) => {
    // CASE 1: SHORT STRING (FITS IN ONE CHUNK)
    if (content.length <= 64) {
      return Core.Metadatum.newText(content);
    }

    // CASE 2: LONG STRING (NEEDS SPLITTING)
    // REGEX SPLITS THE STRING EVERY 64 CHARACTERS
    const chunks = content.match(/.{1,64}/g) || [];
    const list = new Core.MetadatumList();
    
    chunks.forEach(chunk => {
      list.add(Core.Metadatum.newText(chunk));
    });

    return Core.Metadatum.newList(list);
  };

  // Notes management functions
  const addNote = async (note) => {
    try {
      const newNote = await createNoteAPI(note);
      setNotes([newNote, ...notes]);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteNoteAPI(id);
      setNotes(notes.filter((note) => note.id !== id));
      if (editingNote && editingNote.id === id) setEditingNote(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const confirmDelete = async (id) => {
    const ok = window.confirm('Move note to Recently Deleted?');
    if (!ok) return;
    try {
      const updated = await moveToTrash(id);
      setNotes(notes.map(n => n.id === id ? updated : n));
      if (editingNote && editingNote.id === id) setEditingNote(null);
      // Reload to ensure fresh data
      await loadNotes();
      await loadTrashedNotes();
    } catch (error) {
      console.error('Failed to move to trash:', error);
    }
  };

  const purgeNote = async (id) => {
    const ok = window.confirm('Delete forever? This cannot be undone.');
    if (!ok) return;
    try {
      await permanentlyDelete(id);
      setTrashedNotes(trashedNotes.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to permanently delete:', error);
    }
  };

  const restoreNote = async (id) => {
    try {
      const restored = await restoreFromTrash(id);
      setTrashedNotes(trashedNotes.filter(n => n.id !== id));
      // Reload to ensure fresh data
      await loadNotes();
      await loadTrashedNotes();
    } catch (error) {
      console.error('Failed to restore note:', error);
    }
  };

  const startEditNote = (note) => {
    setEditingNote(note);
  };

  const updateNote = async (updatedNote) => {
    try {
      const updated = await updateNoteAPI(updatedNote.id, updatedNote);
      setNotes(notes.map((note) => note.id === updated.id ? updated : note));
      setEditingNote(null);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const updated = await toggleFavoriteAPI(id);
      setNotes(notes.map(n => n.id === id ? updated : n));
      // Reload to ensure fresh data
      await loadNotes();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const counts = useMemo(() => ({
    total: notes.length,
    favorites: notes.filter(n => n.favorite).length,
    deleted: trashedNotes.length,
  }), [notes, trashedNotes]);

  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: dark ? 'linear-gradient(135deg, #0b1220 0%, #0f172a 40%, #111827 100%)' : 'linear-gradient(135deg, #f0f3ffff 0%, #1f4ce0ff 30%, #fdf2f8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Segoe UI, Arial, sans-serif',
        }}
      >
        <div
          style={{
            width: '90%',
             minHeight: 600,
            background: 'rgba(255,255,255,0.9)',
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
                      color:"#0f172a",
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
                      color:"#0f172a",
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
          <Navbar style={{ width: '90%' }} dark={dark} toggleDark={() => setDark(!dark)} />

          <main style={{ width: "100%", marginTop: "6px" }}>
            <Routes>
              <Route path="/" element={<Dashboard notes={notes} trashedNotes={trashedNotes} />} />
              <Route
                path="/notes"
                element={
                  <NotesPage
                    notes={notes}
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
              <Route
                path="/favorites"
                element={
                  <Favorites
                    notes={notes}
                    deleteNote={deleteNote}
                    startEditNote={startEditNote}
                    toggleFavorite={toggleFavorite}
                  />
                }
              />
              <Route
                path="/trash"
                element={<Trash notes={trashedNotes} restoreNote={restoreNote} purgeNote={purgeNote} />}
              />
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