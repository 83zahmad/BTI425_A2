
let page = 1; 
const perPage = 10;
let searchName = null;


document.addEventListener('DOMContentLoaded', () => {
    loadListingsData();
  });

  function updatePageDisplay() {
    document.getElementById("current-page").textContent = `${page}`;
}

function loadListingsData() {
    let url = `https://bti-425-a1-eta.vercel.app/api/listings?page=${page}&perPage=${perPage}`;
    if (searchName) {
      url += `&name=${searchName}`;
    }
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        let tbody = document.querySelector("#listingsTable tbody");
        tbody.innerHTML = "";
        if (data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="4"><strong>No data available</strong></td></tr>`;
          if (page > 1) page--;
          return;
        }
        let rows = data.map((listing) => `
          <tr data-id="${listing._id}">
            <td>${listing.name}</td>
            <td>${listing.room_type}</td>
            <td>${listing.address?.street || "N/A"}</td>
            <td>${listing.summary || "No summary available"}</td>
          </tr>
        `).join("");
        tbody.innerHTML = rows;
        document.querySelectorAll("#listingsTable tbody tr").forEach((row) => {
          row.addEventListener("click", () => {
            const id = row.getAttribute("data-id");
            loadModalData(id);
          });
        });
      })
      .catch((err) => {
        console.error("Error loading data:", err);
      });
  }
  
  function loadModalData(id) {
    fetch(`https://bti-425-a1-eta.vercel.app/api/listings/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        document.querySelector("#detailsModal .modal-title").textContent = data.name;
        document.querySelector("#detailsModal .modal-body").innerHTML = 
          `<img class="img-fluid w-100" src="${data.images?.picture_url || 'https://placehold.co/600x400?text=Photo+Not+Available'}" alt="${data.name}">
          <p>${data.neighborhood_overview || "No neighborhood overview available"}</p>
          <strong>Price:</strong> $${Number(data.price).toFixed(2)}<br>
          <strong>Room:</strong> ${data.room_type}<br>
          <strong>Bed:</strong> ${data.bed_type} (${data.beds || 0} beds)
        `;
        const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
        modal.show();
      })
      .catch((err) => {
        console.error("Error loading modal data:", err);
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("current-page").textContent = `${page}`;
  })

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("previous-page").addEventListener("click", () => {
        event.preventDefault();
        if (page > 1) {
            page--;
            loadListingsData();
            updatePageDisplay();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {    
document.getElementById("next-page").addEventListener("click", () => {
        event.preventDefault();
        page++;
        loadListingsData();
        updatePageDisplay();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("searchForm").addEventListener("submit", (event) => {
        event.preventDefault();
        let searchInput = document.getElementById("name").value;
        searchName = searchInput;
        page = 1;
        loadListingsData();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("clearForm").addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("name").value = "";
        searchName = "";
        loadListingsData();
    });
});

