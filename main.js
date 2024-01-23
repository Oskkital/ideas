const ideaList = document.querySelector("#idea-list");
const newIdeaInput = document.querySelector("#new-idea-input");
const newIdeaButton = document.querySelector("#add-idea-button");

const ideas = [];

const app = {
  ideas: ideas,
  ideasList: ideaList,
  newIdeaInput: newIdeaInput,
};

function saveIdeasToLocalStorage(ideas) {
  localStorage.setItem("ideas", JSON.stringify(ideas));
}

function editIdea(idea) {
  const newTitle = prompt("Editar idea:", idea.title);
  if (newTitle !== null) {
    idea.title = newTitle;
    saveIdeasToLocalStorage(app.ideas);
    updateIdeaElement(idea);
  }
}

function updateIdeaElement(idea) {
  const ideaElement = document.querySelector(`[data-idea-id="${idea.id}"]`);
  const ideaText = ideaElement.querySelector(".idea-text");
  ideaText.textContent = idea.title;
}

window.onload = () => {
  const savedIdeas = JSON.parse(localStorage.getItem("ideas")) || [];
  app.ideas = savedIdeas.map((idea) => {
    return createIdea(idea.title, idea.isRead, idea.date);
  });
  app.ideas.forEach((idea) => {
    return addIdeaToList(idea, app.ideasList);
  });

  function createIdea(
    title,
    isRead = false,
    date = new Date().toLocaleString()
  ) {
    return {
      id: Date.now(),
      title,
      isRead,
      date,
    };
  }

  function addIdeaToList(idea, ideaList) {
    const ideaElement = createIdeaElement(idea);
    ideaList.appendChild(ideaElement);
  }

  function addIdea(app) {
    const newIdeaTitle = app.newIdeaInput.value;
    const newIdea = createIdea(newIdeaTitle);
    app.ideas.push(newIdea);

    addIdeaToList(newIdea, app.ideasList);
    saveIdeasToLocalStorage(app.ideas);
    app.newIdeaInput.value = "";

    console.log("Nueva idea añadida:", newIdea);
  }

  function createIdeaElement(idea) {
    const ideaElement = document.createElement("li");
    const ideaCheckbox = document.createElement("input");
    ideaCheckbox.type = "checkbox";
    ideaCheckbox.checked = idea.isRead;

    const ideaContainer = document.createElement("div");

    const ideaText = document.createElement("span");
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
    ideaEditButton.addEventListener("click", () => {
      editIdea(idea);
    });

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
    ideaDate.textContent = idea.date;

    ideaContainer.appendChild(ideaText);
    ideaElement.appendChild(ideaCheckbox);
    ideaElement.appendChild(ideaContainer);
    ideaElement.appendChild(ideaEditButton);
    ideaElement.appendChild(ideaDeleteButton);
    ideaElement.appendChild(ideaDate);
    ideaElement.setAttribute("data-idea-id", idea.id);

    return ideaElement;
  }

  newIdeaButton.addEventListener("click", () => {
    addIdea(app);
  });

  newIdeaInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addIdea(app);
    }
  });
};
