const Graphurl = axios.create({ baseURL: "http://localhost:4000" });

// const executeQuery = async (query) => {
//   try {
//     const response = await Graphurl.post("/", { query });
//     return response.data.data;
//   } catch (err) {
//     console.error("Error con Axios:", err.message);
//     throw err;  // Lanza el error para que pueda ser capturado por el manejador de errores en la llamada a la función
//   }
// };

const executeQuery = async (query) => {
  const { data } = await $.ajax({
    url: "http://localhost:4000",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ query }),
    success: (res) => res.data.data,
    error: (xhr, status, error) => {
      console.error("Error con jQuery AJAX:", error);
      throw new Error(error); // Lanza el error para que pueda ser capturado por el manejador de errores en la llamada a la función
    }
  });
  return data
};


async function getAllBooks() {
  const query = `query { books { id title author content } }`;
  try {
    const data = await executeQuery(query);
    renderOptions(data.books);
    return data.books[0]?.id;  // Asegúrate de devolver un valor seguro
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

function getBook(id) {
  const query = `query { book(id: ${id}) { id title author content } }`;
  executeQuery(query)
    .then(data => {
      const book = data.book;
      if (book) {
        window.book = book
        $("#author").text(book.author);
        $("#title").text(book.title);
        $("#content").text(book.content);
        $("#btnformdelete").off('click').on('click', () => deleteBook(id));  // Usa off para evitar múltiples asignaciones
      } else {
        $("#title").text("Book not found.");
      }
    })
    .catch(() => {
      $("#title").text("Error al cargar datos.");
    });
}

function deleteBook(id) {
  const query = `query { dbook(id: ${id}) }`;
  executeQuery(query)
    .then(data => {
      return Swal.fire({
        title: "Good job!",
        text: `${data.dbook}`,
        icon: "success"
      });
    })
    .then((result) => {
      if (result.isConfirmed) {
        location.reload();
      }
    })
    .catch(error => {
      console.error("Error deleting book:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue deleting the book.",
        icon: "error"
      });
    });
}

function newBook({ title, author, content }) {
  const query = `mutation {
    addBook(title: "${title}", author: "${author}", content: "${content}")
  }`;
  executeQuery(query)
    .then(data => {
      return Swal.fire({
        title: "Good job!",
        text: `${data.addBook}`,
        icon: "success"
      });
    })
    .then((result) => {
      if (result.isConfirmed) {
        location.reload();
      }
    })
    .catch(error => {
      console.error("Error adding book:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue adding the book.",
        icon: "error"
      });
    });
}

function updateBook({ id, title, author, content }) {
  const query = `mutation {
    editBook(id: ${id}, title: "${title}", author: "${author}", content: "${content}")
  }`;
  
  executeQuery(query)
    .then(data => {
      return Swal.fire({
        title: "Good job!",
        text: `${data.editBook}`,
        icon: "success"
      });
    })
    .then((result) => {
      if (result.isConfirmed) {
        location.reload();
      }
    })
    .catch(error => {
      console.error("Error updating book:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue updating the book.",
        icon: "error"
      });
    });
}


// Llama a getAllBooks y luego a getBook con el ID del primer libro
getAllBooks()
  .then(id => {
    if (id) {
      getBook(id);
    }else {
      $("#title").text("No hay datos para cargar.");
      $("#btnformupdate").attr("disabled", true);
    }
  });
