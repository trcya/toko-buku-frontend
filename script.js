const API_URL = 'http://localhost:3000/buku';

// 1. Ambil & Tampilkan Data
async function ambilBuku() {
    const respon = await fetch(API_URL);
    const data = await respon.json();
    const tabel = document.getElementById('tabel-buku');
    tabel.innerHTML = '';
    
    data.forEach(buku => {
        tabel.innerHTML += `
            <tr class="hover:bg-gray-50 border-b">
                <td class="p-4 text-blue-600 font-mono">#${buku.id}</td>
                <td class="p-4 font-medium">${buku.judul}</td>
                <td class="p-4 text-gray-600">${buku.penulis}</td>
                <td class="p-4 flex gap-2 justify-center">
                    <button onclick="siapkanEdit(${buku.id}, '${buku.judul}', '${buku.penulis}')" 
                        class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm transition">Edit</button>
                    <button onclick="hapusBuku(${buku.id})" 
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition">Hapus</button>
                </td>
            </tr>`;
    });
}

// 2. Tambah / Simpan Data
async function tambahBuku() {
    const judul = document.getElementById('judul').value;
    const penulis = document.getElementById('penulis').value;
    if (!judul || !penulis) return alert("Isi semua data!");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul, penulis })
    });

    bersihkanInput();
    ambilBuku();
}

// 3. Hapus Data dengan Notifikasi
async function hapusBuku(id) {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini secara permanen?")) {
        try {
            const respon = await fetch(`${API_URL}/${id}`, { 
                method: 'DELETE' 
            });

            if (respon.ok) {
                console.log(`Buku ID ${id} terhapus`);
                ambilBuku(); // Refresh tabel
            } else {
                const errorData = await respon.json();
                alert("Gagal menghapus: " + errorData.message);
            }
        } catch (error) {
            console.error("Koneksi gagal:", error);
            alert("Tidak dapat terhubung ke server.");
        }
    }
}

// 4. Logika Edit dengan Validasi
async function siapkanEdit(id, judulLama, penulisLama) {
    const judulBaru = prompt("Edit Judul Buku:", judulLama);
    const penulisBaru = prompt("Edit Nama Penulis:", penulisLama);
    
    // Pastikan user tidak mengosongkan input atau menekan cancel
    if (judulBaru !== null && penulisBaru !== null) {
        if (judulBaru.trim() === "" || penulisBaru.trim() === "") {
            return alert("Judul dan Penulis tidak boleh kosong!");
        }

        try {
            const respon = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ judul: judulBaru, penulis: penulisBaru })
            });

            if (respon.ok) {
                ambilBuku();
            } else {
                alert("Gagal memperbarui data.");
            }
        } catch (error) {
            alert("Terjadi kesalahan koneksi.");
        }
    }
}