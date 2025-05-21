// static/js/etudiants.js

function toggleAdvancedSearch() {
	const advancedFilters = document.getElementById('advanced-filters');
	const toggleText = document.getElementById('advanced-toggle-text');
	const toggleIcon = document.getElementById('toggle-icon');

	advancedFilters.classList.toggle('active');

	if (advancedFilters.classList.contains('active')) {
		toggleText.textContent = 'Masquer les filtres avancés';
		toggleIcon.textContent = '▲';
	} else {
		toggleText.textContent = 'Afficher les filtres avancés';
		toggleIcon.textContent = '▼';
	}
}

function resetFilters() {
	document.querySelectorAll('input, select').forEach(element => {
		if (element.id === 'annee') {
			element.value = '2024-2025';
		} else {
			element.value = '';
		}
	});
}

function applyFilters() {
	alert('Recherche appliquée avec les filtres sélectionnés');
	document.getElementById('result-count').textContent = '(7)';
}

function showAddStudentModal() {
	const modal = document.getElementById('add-student-modal');
	modal.classList.add('active');
	document.body.style.overflow = 'hidden';
}

function closeModal() {
	const modal = document.getElementById('add-student-modal');
	modal.classList.remove('active');
	document.body.style.overflow = 'auto';
}

//affichage liste des enfant
document.addEventListener("DOMContentLoaded", function () {
	loadStudents();
});

function loadStudents() {
	fetch('/api/etudiants/') // Assure-toi que cette URL correspond bien à ta vue Django
		.then(response => response.json())
		.then(data => {
			const tbody = document.getElementById('students-table-body');
			tbody.innerHTML = '';

			data.forEach(etudiant => {
				tbody.innerHTML += `
					<tr>
						<td>${etudiant.numero_etudiant || ''}</td>
						<td>${etudiant.nom} ${etudiant.prenom}</td>
						<td>${etudiant.classe}</td>
						<td>${etudiant.niveau_etude}</td>
						<td>${etudiant.programme}</td>
						<td>${etudiant.annee_scolaire}</td>
						<td>
							<span class="status ${etudiant.statut === 'actif' ? 'status-active' : 'status-inactive'}">
								${etudiant.statut}
							</span>
						</td>
						<td>
							<button class="action-btn action-btn-edit">Modifier</button>
							<button class="action-btn action-btn-delete">Supprimer</button>
						</td>
					</tr>
				`;
			});
		})
		.catch(error => {
			console.error("Erreur lors du chargement des étudiants :", error);
		});
}

//Après enregitrement
function saveNewStudent() {
    const form = document.getElementById('add-student-form');
    const formData = new FormData(form);

    fetch('/dashboard/ajouter-etudiant/', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            refreshStudentList();
            form.reset();
        } else {
            alert("Erreur lors de l'enregistrement.");
        }
    })
    .catch(error => {
        console.error("Erreur :", error);
    });
}

// Fonction pour récupérer le CSRF Token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


//Recuperation formulaire
document.getElementById("add-student-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = document.getElementById('add-student-form');
    const formData = new FormData(form);
	console.log(FormData);

    fetch("/etudiants/ajouter/", {
        method: "POST",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            form.reset();
            closeModal();
        } else {
            // Afficher les erreurs spécifiques pour chaque champ
            let errorMessages = '';
            for (const [field, errors] of Object.entries(data.errors)) {
                errorMessages += `${field}: ${errors.join(', ')}\n`;
            }
            alert("Erreur lors de l’ajout:\n" + errorMessages);
        }
    })
    .catch(error => {
        console.error("Erreur lors de l’ajout :", error);
    });
});


// Chargement des étudiants via l'API
function loadStudents() {
    fetch('http://127.0.0.1:8000/api/etudiants/')
        .then(response => response.json())
        .then(data => {
            console.log('Étudiants chargés', data);
            // Afficher les étudiants dans le frontend
        })
        .catch(error => {
            console.error('Erreur lors du chargement des étudiants :', error);
        });
}

// Ajout d'un étudiant via POST
function addStudent(nom, prenom) {
    fetch('http://127.0.0.1:8000/etudiants/ajouter/', {
        method: 'POST',
        body: new URLSearchParams({
            'nom': nom,
            'prenom': prenom,
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,  // Assurez-vous d'inclure le CSRF token ici
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Étudiant ajouté', data);
    })
    .catch(error => {
        console.error('Erreur lors de l’ajout :', error);
    });
}

function saveNewStudent() {
    const form = document.getElementById('add-student-form');
    const formData = new FormData(form);

    fetch('/etudiants/ajouter/', {  // Assurez-vous que l'URL ici est correcte
        method: 'POST',
        body: formData,
        headers: {
            "X-CSRFToken": getCookie("csrftoken"), // Ajout du CSRF token
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            form.reset(); // Reset le formulaire
            loadStudents(); // Recharge les étudiants
        } else {
            alert("Erreur lors de l'enregistrement.");
        }
    })
    .catch(error => {
        console.error("Erreur :", error);
    });
}
