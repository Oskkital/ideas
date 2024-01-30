const ideasContainer = document.querySelector("#ideas-container");
const newIdeaInput = document.querySelector("#new-idea-input");
const newIdeaButton = document.querySelector("#add-idea-button");

const ideas = [];

const app = {
  ideas: ideas,
  ideasContainer: ideasContainer,
  newIdeaInput: newIdeaInput,
};

// Returns the idea object {id, title, isRead}
function createObjectIdea(title, isRead = false) {
  return {
    id: Date.now(),
    title,
    isRead,
  };
}

// Returns the updated idea object {id, title, isRead} with the new title
function editObjectIdea(idea) {
  const newTitle = prompt("Editar idea:", idea.title);
  if (newTitle != null) {
    idea.title = newTitle;
    saveIdeasToLocalStorage(app.ideas);
    updateIdeaTitle(idea);
  }
}

// Adds the given idea to the ideas-container div
function addIdeaToContainer(idea, ideasContainer) {
  const ideaElement = renderCardIdea(idea);
  ideasContainer.appendChild(ideaElement);
}

// Handles the add-idea-button taking the new-idea-input
function handleAddIdeaButton(app) {
  const newIdeaTitle = app.newIdeaInput.value;

  if (newIdeaTitle != "") {
    const newIdea = createObjectIdea(newIdeaTitle);
    app.ideas.push(newIdea);

    addIdeaToContainer(newIdea, app.ideasContainer);
    saveIdeasToLocalStorage(app.ideas);
    app.newIdeaInput.value = "";

    console.log("Nueva idea añadida:", newIdea);
  }
}

// Returns the card-idea element required for the ideas-container
function renderCardIdea(idea) {
  const ideaElement = document.createElement("div");
  ideaElement.setAttribute("id", "card-idea");

  const ideaCheckbox = document.createElement("input");
  ideaCheckbox.type = "checkbox";
  ideaCheckbox.checked = idea.isRead;

  const ideaText = document.createElement("span");
  ideaText.className = "text";
  ideaText.textContent = idea.title;
  ideaText.classList.toggle("completed", idea.isRead);

  ideaCheckbox.addEventListener("change", () => {
    idea.isRead = ideaCheckbox.checked;
    ideaText.classList.toggle("completed", idea.isRead);
    saveIdeasToLocalStorage(app.ideas);
  });

  const ideaEditButton = document.createElement("button");
  ideaEditButton.textContent = "Editar";
  ideaEditButton.className = "edit-button";
  ideaEditButton.addEventListener("click", () => editObjectIdea(idea));

  const ideaDeleteButton = document.createElement("button");
  ideaDeleteButton.textContent = "Eliminar";
  ideaDeleteButton.className = "delete-button";
  ideaDeleteButton.addEventListener("click", () => {
    ideaElement.remove();
    const ideaIndex = app.ideas.indexOf(idea);

    if (ideaIndex > -1) {
      app.ideas.splice(ideaIndex, 1);
    }

    saveIdeasToLocalStorage(app.ideas);
  });

  const ideaDate = document.createElement("span");
  ideaDate.className = "date";
  ideaDate.textContent = getCurrentDate(); // Using the current date

  ideaElement.appendChild(ideaDate);
  ideaElement.appendChild(ideaText);
  ideaElement.appendChild(ideaEditButton);
  ideaElement.appendChild(ideaDeleteButton);
  ideaElement.appendChild(ideaCheckbox);
  ideaElement.setAttribute("data-idea-id", idea.id);

  return ideaElement;
}

// Function that gives the current date
function getCurrentDate() {
  const currentDate = new Date();
  return `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
}

function saveIdeasToLocalStorage(ideas) {
  localStorage.setItem("ideas", JSON.stringify(ideas));
}

// Function to update only the idea title in the UI
function updateIdeaTitle(idea) {
  const ideaElement = document.querySelector(`[data-idea-id="${idea.id}"]`);
  const ideaText = ideaElement.querySelector(".text");
  ideaText.textContent = idea.title;
}

window.onload = () => {
  // Get the list stored in Local Storage to save it in app.ideas
  const savedIdeas = JSON.parse(localStorage.getItem("ideas")) || [];
  app.ideas = savedIdeas.map((idea) =>
    createObjectIdea(idea.title, idea.isRead)
  );

  // Add each idea from app.ideas to ideas-container
  app.ideas.forEach((idea) => addIdeaToContainer(idea, app.ideasContainer));

  // Required events
  newIdeaButton.addEventListener("click", () => handleAddIdeaButton(app));
  newIdeaInput.addEventListener(
    "keydown",
    (event) => event.key === "Enter" && handleAddIdeaButton(app)
  );
};
