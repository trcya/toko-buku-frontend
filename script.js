const API_URL = "http://localhost:3000";

// Load data saat halaman dibuka
document.addEventListener("DOMContentLoaded", loadBuku);

function loadBuku() {
  fetch(`${API_URL}/buku`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tabel-buku");
      tbody.innerHTML = "";

      data.forEach(buku => {
        tbody.innerHTML += `
          <tr class="border-b hover:bg-gray-50">
            <td class="p-4 font-mono text-gray-500">#${buku.id}</td>
            <td class="p-4 font-bold">${buku.judul}</td>
            <td class="p-4">${buku.penulis}</td>
            <td class="p-4 text-center">
              <button onclick="editBuku(${buku.id}, '${buku.judul}', '${buku.penulis}')"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg mr-2 transition">
                Edit
              </button>
              <button onclick="hapusBuku(${buku.id})"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition">
                Hapus
              </button>
            </td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error(err);
    });
}

// Fungsi Tambah Buku
function tambahBuku() {
  const judul = document.getElementById("judul").value;
  const penulis = document.getElementById("penulis").value;

  if (!judul || !penulis) {
    alert("Judul dan penulis wajib diisi!");
    return;
  }

  fetch(`${API_URL}/buku`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ judul, penulis })
  })
  .then(res => res.json())
  .then(() => {
    document.getElementById("judul").value = "";
    document.getElementById("penulis").value = "";
    loadBuku();
  })
  .catch(err => alert("Gagal menambah buku"));
}

// Fungsi Edit Buku (Fitur Baru)
function editBuku(id, judulLama, penulisLama) {
  const judulBaru = prompt("Ubah Judul Buku:", judulLama);
  const penulisBaru = prompt("Ubah Nama Penulis:", penulisLama);

  // Jika user mengisi kedua kolom dan tidak menekan 'Cancel'
  if (judulBaru && penulisBaru) {
    fetch(`${API_URL}/buku/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ judul: judulBaru, penulis: penulisBaru })
    })
    .then(res => {
      if (res.ok) {
        alert("Buku berhasil diperbarui!");
        loadBuku();
      } else {
        alert("Gagal memperbarui buku.");
      }
    })
    .catch(err => console.error(err));
  }
}

// Fungsi Hapus Buku
function hapusBuku(id) {
  if (!confirm("Yakin ingin menghapus buku ini?")) return;

  fetch(`${API_URL}/buku/${id}`, {
    method: "DELETE"
  })
  .then(() => loadBuku())
  .catch(err => alert("Gagal menghapus buku"));
}