/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const notes = require('./notes');

// Handler untuk mendapatkan semua catatan
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// Handler untuk menambahkan catatan baru
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  // Validasi: Judul dan isi catatan harus diisi
  if (!title || !body) {
    const response = h.response({
      status: 'fail',
      message: 'Judul dan isi catatan harus diisi',
    });
    response.code(400); // Bad Request
    return response;
  }

  // Generate ID dan timestamp
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // Buat objek catatan baru
  const newNote = {
    title,
    tags: tags || [], // Jika tags tidak ada, gunakan array kosong
    body,
    id,
    createdAt,
    updatedAt,
  };

  // Tambahkan catatan baru ke array notes
  notes.push(newNote);

  // Berikan respons sukses
  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil ditambahkan',
    data: {
      noteId: id,
    },
  });
  response.code(201); // Created
  return response;
};

// Handler untuk mendapatkan catatan berdasarkan ID
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  // Cari catatan berdasarkan ID
  const note = notes.find((n) => n.id === id);

  // Jika catatan ditemukan, kembalikan data catatan
  if (note) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  // Jika catatan tidak ditemukan, kembalikan respons gagal
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404); // Not Found
  return response;
};

// Handler untuk mengubah catatan berdasarkan ID
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  // Ambil data terbaru dari body request
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  // Cari index catatan berdasarkan ID
  const index = notes.findIndex((note) => note.id === id);

  // Jika catatan ditemukan, perbarui data
  if (index !== -1) {
    notes[index] = {
      ...notes[index], // Pertahankan data yang tidak diubah
      title: title || notes[index].title, // Jika title tidak ada, gunakan yang lama
      tags: tags || notes[index].tags, // Jika tags tidak ada, gunakan yang lama
      body: body || notes[index].body, // Jika body tidak ada, gunakan yang lama
      updatedAt,
    };

    // Berikan respons sukses
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200); // OK
    return response;
  }

  // Jika catatan tidak ditemukan, kembalikan respons gagal
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404); // Not Found
  return response;
};

// Handler untuk menghapus catatan berdasarkan ID
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  // Cari index catatan berdasarkan ID
  const index = notes.findIndex((note) => note.id === id);

  // Jika catatan ditemukan, hapus catatan
  if (index !== -1) {
    notes.splice(index, 1); // Hapus 1 elemen dari array pada posisi index

    // Berikan respons sukses
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200); // OK
    return response;
  }

  // Jika catatan tidak ditemukan, kembalikan respons gagal
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404); // Not Found
  return response;
};

// Ekspor semua handler
module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};