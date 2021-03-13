// * Selectors
console.log(
	"   ▐▀▄      ▄▀▌   ▄▄▄▄▄▄▄             \n   ▌▒▒▀▄▄▄▄▀▒▒▐▄▀▀▒██▒██▒▀▀▄         \n  ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄        \n ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▄▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄     \n▀█▒▒█▌▒▒█▒▒▐█▒▒▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌    \n▀▌▒▒▒▒▒▀▒▀▒▒▒▒▒▀▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐  ▄▄\n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌▄█▒█\n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐▒█▀ \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐▀  \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌    \n▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐     \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌     \n ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐      \n ▐▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▌      \n   ▀▄▄▀▀▀▀▄▄▀▀▀▀▀▀▄▄▀▀▀▀▀▀▄▄▀       \n \nIbarkay"
);
const tollBar = document.querySelector(".toll-bar");
const tableContainer = document.querySelector(".table-container");
const loader = document.querySelector(".container");
const editPopContainer = document.querySelector(".edit-pop-container");
const overlay = document.querySelector(".overlay");
const searchInput = document.querySelector(".search-input");
const selectDropDown = document.querySelector("select");
const resetBtn = document.querySelector(".reset");
const jokeContainer = document.querySelector(".joke-container");
const jokeHeader = document.querySelector(".joke");
const closeJoke = document.querySelector(".close-joke");

// * API's url
const usersAPI = "https://apple-seeds.herokuapp.com/api/users/";
const userExtraAPI = "https://apple-seeds.herokuapp.com/api/users/";
const jokeAPI = async function joke(fname, lastname) {
	overlay.style.visibility = "visible";
	let resp = await fetch(
		`https://api.icndb.com/jokes/random?firstName=${fname}&lastName=${lastname}`
	);
	let jokeData = await resp.json();
	jokeHeader.textContent = jokeData.value.joke;
	jokeContainer.style.visibility = "visible";
};

// *DATA IS HERE.
// ---------------------------
const LS = JSON.stringify(localStorage);
const LSjson = JSON.parse(LS);

let dataLocal; // ?list with all persons objects
async function fetchy() {
	if (!LSjson.data) {
		const resp = await fetch(`${usersAPI}`);
		const data = await resp.json();
		dataLocal = data;
		LSjson.data = dataLocal;
		localStorage.data = JSON.stringify(LSjson);
		console.log("creating localstorage ...");
	} else {
		console.log(`local storage found`);
		let aaa = localStorage.data;
		let bbb = JSON.parse(aaa);
		dataLocal = bbb;
	}
}
// ---------------------------
// ev on Select-menu
selectDropDown.addEventListener("change", () => {
	sortByParam(selectDropDown.value);
});
// ev on close-joke btn
closeJoke.addEventListener("click", () => {
	overlay.style.visibility = "hidden";
	jokeContainer.style.visibility = "hidden";
});
// ev on search input
searchInput.addEventListener("input", (e) => {
	searcher(searchInput.value);
});
// ev on Reset button
resetBtn.addEventListener("click", () => {
	localStorage.clear();
	location.reload();
});
// *Functions
// searcher function
// ---------------------------
function searcher(str) {
	const rexgey = new RegExp(`${str}`, "i");
	const arrSearchs = dataLocal.filter((x) =>
		`${x.lastName}${x.firstName}${x.city}${x.capsule}`.match(rexgey)
	);

	render(arrSearchs);
}
// Sort function
function sortByParam(param) {
	const arrSort = dataLocal.sort((a, b) => {
		//! thank to Tal:)
		if (a[param] > b[param]) {
			return 1;
		}
		return -1;
	});
	render(arrSort);
	return arrSort;
}
// ---------------------------
// element To object selection function
// ---------------------------
function select(element) {
	const chosen = dataLocal.find(
		(x) => x.id === parseInt(element.getAttribute("data-set").split("-")[0])
	);
	try {
		const chosenParam = chosen[element.getAttribute("data-set").split("-")[1]];
	} catch {
		null;
	}
	return chosen;
}
// ---------------------------
// *RUN
// ---------------------------
async function run() {
	// fetch api data
	await fetchy();
	// merge data to one obj per person
	for (const person of dataLocal) {
		async function getExtra() {
			const resp1 = await fetch(`${userExtraAPI}${person.id}`);
			const data1 = await resp1.json();
			person.age = data1.age;
			person.city = data1.city;
			person.hobby = data1.hobby;
			person.gender = data1.gender;
			person.delete = null;
			person.edit = null;
		}
		await getExtra();
	}
	// disable loader
	loader.style.display = "none";

	// render the table
	render();
}
// ---------------------------
// !Main creation function
// render from ARRAY function (if it wont get any she have a default)
// ---------------------------
function render(array = dataLocal) {
	console.log(`trying to make datalocal to localstorage`);
	// sync between datalocal and local storage
	localStorage.data = JSON.stringify(dataLocal);
	// clear the table
	tableContainer.innerHTML = "";
	// crate list of tittles
	const titles = Object.keys(dataLocal[0]);
	// create the matrix
	for (const i of titles) {
		// create title div
		const divTitle = document.createElement("div");
		divTitle.classList.add(`${i}-container`);
		tableContainer.append(divTitle);
		const divFirst = document.createElement("div");
		if (i !== "delete" && i !== "edit") {
			divFirst.classList.add("box");
			divFirst.classList.add("title");
			divFirst.textContent = `${i}`;
		} else {
			divFirst.classList.add("boxHide");
		}
		divFirst.classList.add("box");
		divTitle.append(divFirst);

		for (const j of array) {
			// create div with data in title div
			const div = document.createElement("div");
			div.classList.add("box");
			div.setAttribute("data-set", `${j.id}-${i}`);
			if (div.getAttribute("data-set").match(/id/)) {
				div.textContent = `${j.id}`;
			}
			if (div.getAttribute("data-set").match(/first/)) {
				div.textContent = `${j.firstName}`;
				div.addEventListener("click", () => jokeAPI(j.firstName, j.lastName));
				div.classList.add("name-s");
			}
			if (div.getAttribute("data-set").match(/last/)) {
				div.textContent = `${j.lastName}`;
			}
			if (div.getAttribute("data-set").match(/capsule/)) {
				div.textContent = `${j.capsule}`;
			}
			if (div.getAttribute("data-set").match(/age/)) {
				div.textContent = `${j.age}`;
			}
			if (div.getAttribute("data-set").match(/city/)) {
				div.textContent = `${j.city}`;
			}
			if (div.getAttribute("data-set").match(/gender/)) {
				div.textContent = `${j.gender}`;
			}
			if (div.getAttribute("data-set").match(/hobby/)) {
				div.textContent = `${j.hobby}`;
			}
			if (div.getAttribute("data-set").match(/delete/)) {
				div.classList.add("boxHide");
				const btny = document.createElement("button");
				btny.classList.add("delete-btn");
				btny.textContent = "Delete";
				// *ev on delete button
				// -----------------------------
				btny.addEventListener("click", (e) => {
					editPopContainer.style.visibility = "hidden";

					let t = e.currentTarget.parentElement;
					t = select(t);
					pos = dataLocal.map((e) => e.id).indexOf(t.id); // ? from stackoverflow , nice one
					dataLocal.splice(pos, 1);
					// render
					render();
				});
				// -----------------------------
				div.append(btny);
			}
			if (div.getAttribute("data-set").match(/edit/)) {
				div.classList.add("boxHide");
				const btny = document.createElement("button");
				btny.classList.add("edit-btn");
				btny.textContent = "Edit";
				div.append(btny);
				// ev on edit
				// -----------------------------
				div.addEventListener("click", (e) => {
					overlay.style.visibility = "visible";
					editPopContainer.style.visibility = "visible";
					// reset edit menu
					editPopContainer.innerHTML = "";
					// !object selector
					const t = select(e.currentTarget);
					// editPopContainer
					// heading editmenue
					const editHeading = document.createElement("h4");
					editHeading.textContent = `Editing ${t.firstName} ${t.lastName}`;
					// input capsule
					const capsuleInput = document.createElement("input");
					capsuleInput.setAttribute("type", "text");
					capsuleInput.setAttribute("value", `${t.capsule}`);
					// input city
					const cityInput = document.createElement("input");
					cityInput.setAttribute("type", "text");
					cityInput.setAttribute("value", `${t.city}`);
					// input hobby
					const hobbyInput = document.createElement("input");
					hobbyInput.setAttribute("type", "text");
					hobbyInput.setAttribute("value", `${t.hobby}`);
					// cancel button
					const cancelBtn = document.createElement("button");
					cancelBtn.classList.add("cancel-btn");
					cancelBtn.textContent = "Cancel";
					cancelBtn.addEventListener("click", () => {
						editPopContainer.style.visibility = "hidden";
						overlay.style.visibility = "hidden";
					});
					// save button
					const saveBtn = document.createElement("button");
					saveBtn.classList.add("save-btn");
					saveBtn.textContent = "Save";
					saveBtn.addEventListener("click", () => {
						t.city = cityInput.value;
						t.hobby = hobbyInput.value;
						t.capsule = capsuleInput.value;
						render();
						editPopContainer.style.visibility = "hidden";
						overlay.style.visibility = "hidden";
					});
					// adding content to edit menu
					editPopContainer.append(editHeading);
					editPopContainer.append(capsuleInput);
					editPopContainer.append(cityInput);
					editPopContainer.append(hobbyInput);
					editPopContainer.append(cancelBtn);
					editPopContainer.append(saveBtn);
				});
			}
			// -----------------------------
			divTitle.append(div);
		}
	}
}
// ---------------------------

// call RUN
run();
