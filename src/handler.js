const {nanoid} = require('nanoid');
const books = require('./books');

//menambah data buku
const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    
    //tidak memasukan name
    if(!name){
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }

    //halaman baca > halaman buku
    if(readPage > pageCount){
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        id,
        finished,
        insertedAt,
        updatedAt
    }

    books.push(newBook);
    const isSuccess = books.filter((note) => note.id === id).length > 0;
    if(isSuccess){ 
        const response = h.response({
        "status": "success",
        "message": "Buku berhasil ditambahkan",
        "data": {
            "bookId": id
        }
    })
    response.code(201);
    return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
      });
      response.code(500);
      return response;




}

//mengambil data seluruh buku
const getAllBookHandler = (request, h) => {
    const {name, finished, reading} = request.query;

    if(!name && !finished && !reading){
        const response = h.response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
                })),
                },
        });
        response.code(200);
        return response;
    }

    if(name){
        const filteredName = books.filter((book) => {
            const regExp = new RegExp(name, 'gi');
            return regExp.test(book.name);
        })
        const response = h.response({
            status: 'success',
            data: {
                books: filteredName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            }
        })
        response.code(200);
        return response;
    }

    if(reading){
        const filteredReading = books.filter((book) => Number(book.reading) === Number(reading))
        const response = h.response({
            status: 'success',
            data: {
                books: filteredReading.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
          }))
        }
        })
        response.code(200);
        return response;
    }


    const filteredFinished = books.filter((book) => Number(book.finished) === Number(finished));
    const response = h.response({
        status: 'success',
        data: {
            books: filteredFinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
      }))
    }
    })
    response.code(200);
    return response;

}

//mengambil detail buku dengan id
const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    //jika berhasil
    if(book){
        const response = h.response({
            "status": "success",
            "data": {
                book
            }
        })
        response.code(200);
        return response;
    }

    //jika tidak memasukan id
    const response = h.response({
        "status": "fail",
        "message": "Buku tidak ditemukan"
    })
    response.code(404);
    return response;
}

//mengubah buku
const editBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    //tidak memasukan name
    if(!name){
        const response = h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }

    //halaman baca > halaman buku
    if(readPage > pageCount){
        const response = h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }


    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((index) => index.id === bookId);

    //berhasil memperbarui
    if(index !== -1){
        books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt
        }

        const response = h.response({
            "status": "success",
            "message": "Buku berhasil diperbarui"
        })
        response.code(200);
        return response;
    }

    //id tidak ditemukan
    const response = h.response({
        "status": "fail",
        "message": "Gagal memperbarui buku. Id tidak ditemukan"
    })
    response.code(404);
    return response;
}
    
const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;

    const index = books.findIndex((n) => n.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
    
        // Bila id dimiliki oleh salah satu buku
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200);
        return response;
      }
    
      // Bila id yang dilampirkan tidak dimiliki oleh buku manapun
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
      })
      response.code(404);
      return response;
}

module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
}