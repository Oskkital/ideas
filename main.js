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
  if (newTitle != "") {
    idea.title = newTitle;
    saveIdeasToLocalStorage(app.ideas);
    updateIdeaElement(idea);
  }
}

function updateIdeaElement(idea) {
  const ideaElement = document.querySelector(`[data-idea-id="${idea.id}"]`);
  const ideaText = ideaElement.querySelector("span");
  ideaText.textContent = idea.title;
}

window.onload = () => {
  const savedIdeas = JSON.parse(localStorage.getItem("ideas")) || [];
  app.ideas = savedIdeas.map((idea) => {
    return createIdea(idea.title, idea.isRead);
  });
  app.ideas.forEach((idea) => {
    return addIdeaToList(idea, app.ideasList);
  });

  function createIdea(title, isRead = false) {
    return {
      id: Date.now(),
      title,
      isRead,
    };
  }

  function addIdeaToList(idea, ideaList) {
    const ideaElement = renderTable(idea);
    ideaList.appendChild(ideaElement);
  }

  function addIdea(app) {
    const newIdeaTitle = app.newIdeaInput.value;
    console.log(typeof newIdeaTitle);
    if (newIdeaTitle != "") {
      const newIdea = createIdea(newIdeaTitle);
      app.ideas.push(newIdea);

      addIdeaToList(newIdea, app.ideasList);
      saveIdeasToLocalStorage(app.ideas);
      app.newIdeaInput.value = "";

      console.log("Nueva idea añadida:", newIdea);
    }
  }

  function renderTable(idea) {
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

    const currentDate = new Date();

    const formattedDate = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    ideaDate.textContent = formattedDate;

    ideaElement.appendChild(ideaDate);
    ideaElement.appendChild(ideaText);
    ideaElement.appendChild(ideaEditButton);
    ideaElement.appendChild(ideaDeleteButton);
    ideaElement.appendChild(ideaCheckbox);

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
