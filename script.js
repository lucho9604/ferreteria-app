// script.js
// Funciones para interactuar con el servidor (mis endpoints: /chain y /add)

async function verChain() {
  try {
    const res = await fetch("/chain");
    if (!res.ok) throw new Error("Error al obtener la cadena");
    const data = await res.json();
    document.getElementById("blockchain").textContent = JSON.stringify(data, null, 2);
    console.log("Chain:", data);
  } catch (err) {
    console.error(err);
    document.getElementById("blockchain").textContent = "Error: " + err.message;
  }
}

async function addSampleBlock() {
  // ejemplo: agregamos una venta simple como bloque
  const payload = {
    data: {
      venta: {
        id: Date.now(),
        producto: "Martillo",
        cantidad: 1,
        precio: 45,
        usuario: "demo"
      }
    }
  };

  try {
    const res = await fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error agregando bloque");
    document.getElementById("blockchain").textContent = JSON.stringify(json, null, 2);
  } catch (err) {
    console.error(err);
    document.getElementById("blockchain").textContent = "Error: " + err.message;
  }
}

// Código para agregar filas a la tabla (conectar UI)
document.getElementById("agregarBtn")?.addEventListener("click", () => {
  const codigo = document.getElementById("codigo").value || "NA";
  const desc = document.getElementById("descripcion").value || "Sin descripción";
  const cant = Number(document.getElementById("cantidad").value) || 1;
  const precio = Number(document.getElementById("precio").value) || 0;
  const total = cant * precio;

  const tbody = document.getElementById("tablaProductos");
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${codigo}</td><td>${desc}</td><td>${cant}</td><td>${precio}</td><td>${total}</td>`;
  tbody.appendChild(tr);

  // actualizar total a pagar
  const totalEl = document.getElementById("total");
  totalEl.textContent = (Number(totalEl.textContent || 0) + total).toFixed(2);

  // opcional: agregar cada venta a la blockchain automáticamente
  // fetch('/add', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ data: { venta: { codigo, desc, cant, precio } } })})
  //   .then(r => r.json()).then(x=>console.log('block added', x)).catch(e=>console.error(e));
});

// si la página carga y hay el botón, mostrar la cadena
window.addEventListener("load", () => {
  // mostrar cadena inicialmente (si existe)
  // verChain(); // descomenta si quieres que cargue automáticamente
});
