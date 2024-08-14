// Instancias de modales
const createModal = createModalInstance("formCreateModal");
const updateModal = createModalInstance("formUpdateModal");

// Función para crear instancias de modales
function createModalInstance(modalId) {
  return new bootstrap.Modal(document.getElementById(modalId), {
    backdrop: "static",
    keyboard: false,
  });
}

// Manejar clic en los botones para mostrar los modales
$("#btnformcreate, #btnformupdate").click(function () {
  const modal = $(this).is("#btnformcreate") ? createModal : updateModal;
  if($(this).is("#btnformupdate")){
    renderUpdate()
  }
  modal.show();
});

// Manejar la sumisión del formulario y mostrar datos en el modal
$("#postForm, #putForm").submit(function (e) {
  e.preventDefault(); // Prevenir la recarga de la página

  const formData = new FormData(this);
  const formValues = {
    id: formData.get("id"),
    title: formData.get("title"),
    author: formData.get("author"),
    content: formData.get("content"),
  };

  if($(this).is("#postForm")) {
    console.table(formValues)
    newBook(formValues)
  }else {
    console.table(formValues)
    updateBook(formValues);
  }


  this.reset();

  createModal.hide(); 
  updateModal.hide();// O updateModal dependiendo del contexto
});

// Renderizar opciones
function renderOptions(data) {
  const booksList = $("#booksList").empty(); // Limpiar la lista actual

  data.forEach((book) => {
    $("<button>")
      .addClass("btn btn-secondary btn-option")
      .text(book.title)
      .click(() => getBook(book.id))
      .appendTo(booksList);
  });
}

function renderUpdate(){
  $("#modalID").val(window.book.id);
  $("#modalAuthorUpdate").val(window.book.author);
  $("#modalTitleUpdate").val(window.book.title);
  $("#modalContentUpdate").val(window.book.content);
}