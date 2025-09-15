// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, data, previousHash = "") {
    this.index = index;
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.createHash();
  }

  createHash() {
    return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
  }
}

class BlockChain {
  constructor(genesisData) {
    this.chain = [this.createFirstBlock(genesisData)];
  }
  createFirstBlock(genesisData) {
    return new Block(0, genesisData, "0");
  }
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(data) {
    const previousBlock = this.getLastBlock();
    const newBlock = new Block(previousBlock.index + 1, data, previousBlock.hash);
    this.chain.push(newBlock);
    return newBlock;
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// carpeta 'public' sirve los archivos estáticos (index.html, dashboard.html, css, script)
app.use(express.static(path.join(__dirname, "public")));

const chain = new BlockChain({ info: "Genesis - Ferretería Estanley" });

app.get("/chain", (req, res) => {
  res.json(chain.chain);
});

app.post("/add", (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "Falta campo data" });
  const newBlock = chain.addBlock(data);
  res.json({ message: "Bloque agregado", block: newBlock, chain: chain.chain });
});

// si quieres forzar index.html en la raíz (útil si accedes a /)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
