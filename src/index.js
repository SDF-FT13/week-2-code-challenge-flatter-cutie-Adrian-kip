document.addEventListener('DOMContentLoaded', () => {
    const characterBar = document.getElementById('character-bar');
    const detailedInfo = document.getElementById('detailed-info');
    const votesForm = document.getElementById('votes-form');
    const characterForm = document.getElementById('character-form');
    const resetBtn = document.getElementById('reset-btn');
    const baseUrl = 'http://localhost:3005/characters';
    
    let currentCharacter = null;
  
    function fetchCharacters() {
      fetch(baseUrl)
        .then(response => response.json())
        .then(characters => {
          characterBar.innerHTML = '';
          characters.forEach(character => {
            const span = document.createElement('span');
            span.textContent = character.name;
            span.addEventListener('click', () => showCharacterDetails(character));
            characterBar.appendChild(span);
          });
          if (characters.length > 0) showCharacterDetails(characters[0]);
        });
    }
  
    function showCharacterDetails(character) {
      currentCharacter = character;
      detailedInfo.innerHTML = `
        <h2 class="character-name">${character.name}</h2>
        <img class="character-image" src="${character.image}" alt="${character.name}" />
        <div class="votes-container">
          <span class="votes-label">Votes:</span>
          <span class="votes-count">${character.votes}</span>
        </div>
        <form id="votes-form" class="votes-form">
          <input type="number" class="votes-input" placeholder="Enter votes" required />
          <button type="submit" class="votes-button">Add Votes</button>
        </form>
        <button class="reset-button">Reset Votes</button>
      `;
      
      document.getElementById('votes-form').addEventListener('submit', handleVoteSubmit);
      document.querySelector('.reset-button').addEventListener('click', handleResetVotes);
    }
  
    function handleVoteSubmit(e) {
      e.preventDefault();
      const votesToAdd = parseInt(e.target.querySelector('.votes-input').value) || 0;
      currentCharacter.votes += votesToAdd;
      document.querySelector('.votes-count').textContent = currentCharacter.votes;
      updateCharacter(currentCharacter);
      e.target.reset();
    }
  
    function handleResetVotes() {
      currentCharacter.votes = 0;
      document.querySelector('.votes-count').textContent = 0;
      updateCharacter(currentCharacter);
    }
  
    characterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = e.target.name.value.trim();
      const image = e.target['image-url'].value.trim();
      
      if (!name || !image) return;
      
      fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image, votes: 0 })
      })
        .then(response => response.json())
        .then(character => {
          const span = document.createElement('span');
          span.textContent = character.name;
          span.addEventListener('click', () => showCharacterDetails(character));
          characterBar.appendChild(span);
          showCharacterDetails(character);
          e.target.reset();
        });
    });
  
    function updateCharacter(character) {
      fetch(`${baseUrl}/${character.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character)
      });
    }
  
    fetchCharacters();
  });