// GANTI link di bawah ini dengan URL backend Vercel kamu yang asli
// Contoh: https://toko-buku-backend-terecyas-projects.vercel.app
const API_URL = "https://toko-buku-backend-terecyas-projects.vercel.app";

// Load data saat halaman dibuka
document.addEventListener("DOMContentLoaded", loadBuku);

function loadBuku() {
  fetch(`${API_URL}/buku`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tabel-buku");
      tbody.innerHTML = "";

      // Menggunakan (buku, index) agar ID di tabel urut 1, 2, 3...
      data.forEach((buku, index) => {
        tbody.innerHTML += `
          <tr class="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-300">
            <td class="p-4 font-bold text-blue-600">#${index + 1}</td>
            <td class="p-4 font-bold text-gray-800">${buku.judul}</td>
            <td class="p-4 text-gray-600">${buku.penulis}</td>
            <td class="p-4 text-center">
              <button onclick="editBuku(${buku.id}, '${buku.judul}', '${buku.penulis}')"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-xl mr-2 transition active:scale-90 shadow-md">
                Edit
              </button>
              <button onclick="hapusBuku(${buku.id})"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-xl transition active:scale-90 shadow-md">
                Hapus
              </button>
            </td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error("Gagal memuat data:", err);
    });
}

// Fungsi Tambah Buku
function tambahBuku() {
  const judul = document.getElementById("judul").value;
  const penulis = document.getElementById("penulis").value;

  if (!judul || !penulis) {
    Swal.fire('Oops!', 'Judul dan penulis wajib diisi!', 'warning');
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
    loadBuku(); // Refresh tabel
    Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Buku masuk database', timer: 1500, showConfirmButton: false });
  })
  .catch(err => Swal.fire('Error', 'Gagal menambah buku', 'error'));
}

// Fungsi Hapus Buku dengan SweetAlert2
function hapusBuku(id) {
    Swal.fire({
        title: 'Konfirmasi Hapus',
        text: "Yakin ingin menghapus buku ini dari database?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', 
        cancelButtonColor: '#1e3a8a',  
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
        borderRadius: '20px'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}/buku/${id}`, { method: "DELETE" })
            .then(() => {
                Swal.fire({ title: 'Terhapus!', text: 'Buku telah dihapus.', icon: 'success', timer: 1500, showConfirmButton: false });
                loadBuku();
            })
            .catch(err => Swal.fire('Error', 'Gagal menghapus buku', 'error'));
        }
    });
}

// Fungsi Edit Buku dengan SweetAlert2
async function editBuku(id, judulLama, penulisLama) {
    const { value: formValues } = await Swal.fire({
        title: 'Edit Informasi Buku',
        html:
            `<input id="swal-input1" class="swal2-input" placeholder="Judul" value="${judulLama}">` +
            `<input id="swal-input2" class="swal2-input" placeholder="Penulis" value="${penulisLama}">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Simpan Perubahan',
        confirmButtonColor: '#2563eb',
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ]
        }
    });

    if (formValues && formValues[0] && formValues[1]) {
        fetch(`${API_URL}/buku/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ judul: formValues[0], penulis: formValues[1] })
        })
        .then(res => {
            if (res.ok) {
                Swal.fire({ icon: 'success', title: 'Berhasil!', timer: 1000, showConfirmButton: false });
                loadBuku();
            }
        });
    }
}