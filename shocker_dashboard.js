window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const greet = document.getElementById("dashboardGreeting");

  if (user && greet) {
    greet.innerHTML = `👋 Welcome, ${user.name} (${user.role.toUpperCase()})`;
  }

  // Optional: Hide admin-only features for viewers
  if (user?.role === "viewer") {
    document.querySelectorAll(".admin-only").forEach(el => {
      el.style.display = "none";
    });
  }
});
function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  
  function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();
    alert("Search for: " + query);
  }
  
  function applyDropdownFilter() {
    const value = document.getElementById('filterSelect').value;
    alert("Filtering by: " + value);
  }
  
  // Sample Chart Initialization
  window.onload = function () {
    const userChart = new Chart(document.getElementById('userChart'), {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Chats',
          data: [70, 85, 60, 120, 90],
          backgroundColor: '#000000',  // Black bars
borderColor: '#ffcd00'
        }]
      }
    });
  
    const faqChart = new Chart(document.getElementById('faqChart'), {
      type: 'pie',
      data: {
        labels: ['Admissions', 'Finance', 'Housing', 'Tech Support'],
        datasets: [{
          label: 'Topics',
          data: [45, 25, 15, 15],
          backgroundColor: ['#000000', '#ffcd00', '#f5f5f5', '#888888']
        }]
      }
    });
  }

   /* chat logs */
  function flagChat(btn) {
    btn.innerHTML = "✅ Flagged";
    btn.disabled = true;
  }
  
  function filterChatLogs() {
    const input = document.getElementById('chatSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#chatLogData tr');
    rows.forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(input) ? '' : 'none';
    });
  }
  
  function applyChatFilter() {
    const filter = document.getElementById('logFilter').value;
    const rows = document.querySelectorAll('#chatLogData tr');
    rows.forEach(row => {
      const status = row.querySelector('.status-tag');
      if (filter === 'all') row.style.display = '';
      else if (filter === 'unanswered') row.style.display = status.classList.contains('unanswered') ? '' : 'none';
      else if (filter === 'flagged') row.style.display = row.innerHTML.includes('✅') ? '' : 'none';
      else if (filter === 'today') {
        const date = row.cells[0].innerText.split(' ')[0];
        const today = new Date().toISOString().split('T')[0];
        row.style.display = date === today ? '' : 'none';
      }
    });
  }
  
  function exportChatLogs() {
    alert("Exporting chat logs... (CSV generation feature coming soon!)");
  }
  function toggleFlag(button) {
    if (button.innerText.includes("Flag")) {
      button.innerHTML = "✅ Unflag";
      button.style.backgroundColor = "#d1e7dd";
      button.style.color = "#155724";
    } else {
      button.innerHTML = "🚩 Flag";
      button.style.backgroundColor = "";
      button.style.color = "";
    }
  }
    /* faqs */
    function openAddFAQModal() {
        document.getElementById("faqModalTitle").innerText = "Add FAQ";
        document.getElementById("faqQuestion").value = "";
        document.getElementById("faqAnswer").value = "";
        document.getElementById("faqTopic").value = "";
        document.getElementById("faqModal").style.display = "flex";
      }
      
      function closeFAQModal() {
        document.getElementById("faqModal").style.display = "none";
      }
      
      function saveFAQ() {
        const question = document.getElementById("faqQuestion").value;
        const answer = document.getElementById("faqAnswer").value;
        const topic = document.getElementById("faqTopic").value;
      
        if (!question || !answer || !topic) {
          alert("Please fill all fields!");
          return;
        }
      
        const faqCard = document.createElement("div");
        faqCard.classList.add("faq-card");
        faqCard.setAttribute("data-topic", topic);
        faqCard.innerHTML = `
          <h3>${question}</h3>
          <p>${answer}</p>
          <span class="faq-topic">${topic}</span>
          <div class="faq-actions">
            <button onclick="editFAQ(this)">✏️ Edit</button>
            <button onclick="deleteFAQ(this)">🗑️ Delete</button>
          </div>
        `;
        document.getElementById("faqList").appendChild(faqCard);
        closeFAQModal();
      }
      
      function deleteFAQ(button) {
        if (confirm("Are you sure you want to delete this FAQ?")) {
          button.closest(".faq-card").remove();
        }
      }
      
      function editFAQ(button) {
        const card = button.closest(".faq-card");
        document.getElementById("faqModalTitle").innerText = "Edit FAQ";
        document.getElementById("faqQuestion").value = card.querySelector("h3").innerText;
        document.getElementById("faqAnswer").value = card.querySelector("p").innerText;
        document.getElementById("faqTopic").value = card.getAttribute("data-topic");
      
        // Remove old card after opening modal (will be replaced on save)
        card.remove();
        document.getElementById("faqModal").style.display = "flex";
      }
      
      function filterFAQs() {
        const search = document.getElementById("faqSearch").value.toLowerCase();
        const topicFilter = document.getElementById("faqCategoryFilter").value.toLowerCase();
        const cards = document.querySelectorAll(".faq-card");
      
        cards.forEach(card => {
          const matchesSearch = card.innerText.toLowerCase().includes(search);
          const matchesTopic = topicFilter === "all" || card.getAttribute("data-topic").toLowerCase() === topicFilter;
          card.style.display = matchesSearch && matchesTopic ? "block" : "none";
        });
      }
/*departments*/
function openDepartmentModal() {
    document.getElementById("deptModalTitle").innerText = "Add Department";
    document.getElementById("deptNameInput").value = "";
    document.getElementById("deptEmailInput").value = "";
    document.getElementById("deptPhoneInput").value = "";
    document.getElementById("deptTagsInput").value = "";
    document.getElementById("departmentModal").style.display = "flex";
  }
  
  function closeDepartmentModal() {
    document.getElementById("departmentModal").style.display = "none";
  }
  
  function saveDepartment() {
    const name = document.getElementById("deptNameInput").value.trim();
    const email = document.getElementById("deptEmailInput").value.trim();
    const phone = document.getElementById("deptPhoneInput").value.trim();
    const tags = document.getElementById("deptTagsInput").value.trim();
  
    if (!name || !email || !phone) {
      alert("Please fill all fields!");
      return;
    }
  
    const li = document.createElement("li");
    li.classList.add("department-card");
    li.setAttribute("data-tags", tags.toLowerCase());
    li.innerHTML = `
      <div class="dept-left">
        <span class="dept-icon"><i class="fas fa-university"></i></span>
        <span class="dept-name">${name}</span>
        <span class="dept-tags">${tags}</span>
      </div>
      <div class="dept-right">
        <span class="dept-contact">📧 ${email}</span>
        <span class="dept-phone">📞 ${phone}</span>
        <button onclick="editDepartment(this)">✏️ Edit</button>
        <button onclick="deleteDepartment(this)">🗑️ Delete</button>
      </div>
    `;
    document.getElementById("departmentList").appendChild(li);
    closeDepartmentModal();
  }
  
  function deleteDepartment(button) {
    if (confirm("Delete this department?")) {
      button.closest(".department-card").remove();
    }
  }
  
  function editDepartment(button) {
    const card = button.closest(".department-card");
    const name = card.querySelector(".dept-name").innerText;
    const email = card.querySelector(".dept-contact").innerText.replace("📧 ", "");
    const phone = card.querySelector(".dept-phone").innerText.replace("📞 ", "");
    const tags = card.getAttribute("data-tags");
  
    document.getElementById("deptNameInput").value = name;
    document.getElementById("deptEmailInput").value = email;
    document.getElementById("deptPhoneInput").value = phone;
    document.getElementById("deptTagsInput").value = tags;
    card.remove();
    openDepartmentModal();
  }
  
  function filterDepartments() {
    const input = document.getElementById("searchDepartment").value.toLowerCase();
    const cards = document.querySelectorAll(".department-card");
    cards.forEach(card => {
      const content = card.innerText.toLowerCase() + card.getAttribute("data-tags");
      card.style.display = content.includes(input) ? "flex" : "none";
    });
  }
/*directory*/
function openDirectoryModal() {
    document.getElementById("directoryModalTitle").innerText = "Add Person";
    ['dirName', 'dirTitle', 'dirDept', 'dirEmail', 'dirPhone', 'dirHours', 'dirTags'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById("dirStatus").value = "Active";
    document.getElementById("directoryModal").style.display = "flex";
  }
  
  function closeDirectoryModal() {
    document.getElementById("directoryModal").style.display = "none";
  }
  
  function saveDirectory() {
    const name = document.getElementById("dirName").value;
    const title = document.getElementById("dirTitle").value;
    const dept = document.getElementById("dirDept").value;
    const email = document.getElementById("dirEmail").value;
    const phone = document.getElementById("dirPhone").value;
    const hours = document.getElementById("dirHours").value;
    const tags = document.getElementById("dirTags").value;
    const status = document.getElementById("dirStatus").value;
  
    if (!name || !title || !dept || !email) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const card = document.createElement("div");
    card.classList.add("directory-card");
    card.setAttribute("data-tags", tags.toLowerCase());
    card.setAttribute("data-status", status);
    card.innerHTML = `
      <h3>${name}</h3>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Department:</strong> ${dept}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Office Hours:</strong> ${hours}</p>
      <span class="directory-tag">${tags}</span>
      <span class="status ${status === 'Active' ? 'active' : 'leave'}">${status === 'Active' ? '🟢 Active' : '🔴 On Leave'}</span>
      <div class="directory-actions">
        <button onclick="editDirectory(this)">✏️ Edit</button>
        <button onclick="deleteDirectory(this)">🗑️ Delete</button>
      </div>
    `;
    document.getElementById("directoryList").appendChild(card);
    closeDirectoryModal();
  }
  
  function deleteDirectory(button) {
    if (confirm("Delete this entry?")) {
      button.closest(".directory-card").remove();
    }
  }
  
  function editDirectory(button) {
    const card = button.closest(".directory-card");
    document.getElementById("directoryModalTitle").innerText = "Edit Person";
    document.getElementById("dirName").value = card.querySelector("h3").innerText;
    document.getElementById("dirTitle").value = card.querySelectorAll("p")[0].innerText.replace("Title:", "").trim();
    document.getElementById("dirDept").value = card.querySelectorAll("p")[1].innerText.replace("Department:", "").trim();
    document.getElementById("dirEmail").value = card.querySelectorAll("p")[2].innerText.replace("Email:", "").trim();
    document.getElementById("dirPhone").value = card.querySelectorAll("p")[3].innerText.replace("Phone:", "").trim();
    document.getElementById("dirHours").value = card.querySelectorAll("p")[4].innerText.replace("Office Hours:", "").trim();
    document.getElementById("dirTags").value = card.querySelector(".directory-tag").innerText;
    document.getElementById("dirStatus").value = card.getAttribute("data-status");
    card.remove();
    document.getElementById("directoryModal").style.display = "flex";
  }
  
  function filterDirectory() {
    const query = document.getElementById("directorySearch").value.toLowerCase();
    const cards = document.querySelectorAll(".directory-card");
    cards.forEach(card => {
      const content = card.innerText.toLowerCase() + card.getAttribute("data-tags");
      card.style.display = content.includes(query) ? "block" : "none";
    });
  }
  function saveDirectory() {
    const name = document.getElementById("dirName").value;
    const title = document.getElementById("dirTitle").value;
    const dept = document.getElementById("dirDept").value;
    const email = document.getElementById("dirEmail").value;
    const phone = document.getElementById("dirPhone").value;
    const hours = document.getElementById("dirHours").value;
    const tags = document.getElementById("dirTags").value;
    const status = document.getElementById("dirStatus").value;
    const visible = document.getElementById("dirVisibleToBot").checked;
  
    if (!name || !title || !dept || !email) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const card = document.createElement("div");
    card.classList.add("directory-card");
    card.setAttribute("data-tags", tags.toLowerCase());
    card.setAttribute("data-status", status);
    card.setAttribute("data-visible", visible ? "true" : "false");
  
    card.innerHTML = `
      <h3>${name}</h3>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Department:</strong> ${dept}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Office Hours:</strong> ${hours}</p>
      <span class="directory-tag">${tags}</span>
      <span class="status ${status === 'Active' ? 'active' : 'leave'}">${status === 'Active' ? '🟢 Active' : '🔴 On Leave'}</span>
      <div class="directory-actions">
        <button onclick="editDirectory(this)">✏️ Edit</button>
        <button onclick="deleteDirectory(this)">🗑️ Delete</button>
      </div>
    `;
  
    document.getElementById("directoryList").appendChild(card);
    closeDirectoryModal();
  }
/*events*/
// 🔄 Load events on page load
document.addEventListener("DOMContentLoaded", renderEvents);

// 📤 Open modal to add event
function openEventModal() {
  document.getElementById("eventModalTitle").innerText = "Add Event";
  ['eventTitle', 'eventType', 'eventLocation', 'eventDateTime', 'eventDescription'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById("eventFeatured").checked = false;
  document.getElementById("eventPublic").checked = true;
  document.getElementById("eventModal").style.display = "flex";
}

// ❌ Close modal
function closeEventModal() {
  document.getElementById("eventModal").style.display = "none";
}

// ✅ Save event to localStorage
function saveEvent() {
  const title = document.getElementById("eventTitle").value.trim();
  const type = document.getElementById("eventType").value.trim();
  const location = document.getElementById("eventLocation").value.trim();
  const dateTime = document.getElementById("eventDateTime").value;
  const desc = document.getElementById("eventDescription").value.trim();
  const featured = document.getElementById("eventFeatured").checked;
  const isPublic = document.getElementById("eventPublic").checked;

  if (!title || !type || !location || !dateTime) {
    alert("Please fill all required fields.");
    return;
  }

  const events = JSON.parse(localStorage.getItem("campusEvents") || "[]");

  events.push({
    id: Date.now(),
    title, type, location, dateTime, desc, featured, isPublic
  });

  localStorage.setItem("campusEvents", JSON.stringify(events));
  closeEventModal();
  renderEvents();
}

// 📥 Render event cards from localStorage
function renderEvents() {
  const eventList = document.getElementById("eventList");
  if (!eventList) return;

  eventList.innerHTML = "";
  const events = JSON.parse(localStorage.getItem("campusEvents") || "[]");

  events.forEach(event => {
    const card = document.createElement("div");
    card.classList.add("event-card");
    card.setAttribute("data-id", event.id);
    card.setAttribute("data-tags", `${event.title} ${event.type} ${event.location}`.toLowerCase());
    card.setAttribute("data-visible", event.isPublic ? "true" : "false");

    if (event.featured) {
      const badge = document.createElement("div");
      badge.classList.add("event-featured");
      badge.innerText = "⭐ Featured";
      card.appendChild(badge);
    }

    card.innerHTML += `
      <h3>${event.title}</h3>
      <p><strong>Type:</strong> ${event.type}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Date & Time:</strong> ${new Date(event.dateTime).toLocaleString()}</p>
      <p><strong>Description:</strong> ${event.desc}</p>
      <span class="event-tag">${event.type}</span>
      <div class="event-actions">
        <button onclick="editEvent(this)">✏️ Edit</button>
        <button onclick="deleteEvent(this)">🗑️ Delete</button>
      </div>
    `;

    eventList.appendChild(card);
  });
}

// 🧹 Delete event from localStorage
function deleteEvent(button) {
  const card = button.closest(".event-card");
  const id = parseInt(card.getAttribute("data-id"));
  let events = JSON.parse(localStorage.getItem("campusEvents") || "[]");
  events = events.filter(e => e.id !== id);
  localStorage.setItem("campusEvents", JSON.stringify(events));
  renderEvents();
}

// ✏️ Edit event logic
function editEvent(button) {
  const card = button.closest(".event-card");
  const id = parseInt(card.getAttribute("data-id"));
  const events = JSON.parse(localStorage.getItem("campusEvents") || "[]");
  const event = events.find(e => e.id === id);

  document.getElementById("eventTitle").value = event.title;
  document.getElementById("eventType").value = event.type;
  document.getElementById("eventLocation").value = event.location;
  document.getElementById("eventDateTime").value = event.dateTime;
  document.getElementById("eventDescription").value = event.desc;
  document.getElementById("eventFeatured").checked = event.featured;
  document.getElementById("eventPublic").checked = event.isPublic;

  // Remove old version to avoid duplicate
  localStorage.setItem("campusEvents", JSON.stringify(events.filter(e => e.id !== id)));

  document.getElementById("eventModalTitle").innerText = "Edit Event";
  document.getElementById("eventModal").style.display = "flex";
}

// 🔍 Search/filter events
function filterEvents() {
  const query = document.getElementById("eventSearch").value.toLowerCase();
  const cards = document.querySelectorAll(".event-card");
  cards.forEach(card => {
    const tags = card.getAttribute("data-tags");
    card.style.display = tags.includes(query) ? "block" : "none";
  });
}
/*INQUIRY FORMS*/
// 🔁 Load inquiries on page load
document.addEventListener("DOMContentLoaded", renderInquiries);

// 📤 Open modal
function openInquiryModal() {
  document.getElementById("inquiryModalTitle").innerText = "Add Inquiry";
  ["inqName", "inqWSUID", "inqTopic", "inqMessage", "inqTags"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("inquiryModal").style.display = "flex";
}

// ❌ Close modal
function closeInquiryModal() {
  document.getElementById("inquiryModal").style.display = "none";
}

// ✅ Save inquiry
function saveInquiry() {
  const name = document.getElementById("inqName").value.trim();
  const wsuid = document.getElementById("inqWSUID").value.trim();
  const topic = document.getElementById("inqTopic").value;
  const message = document.getElementById("inqMessage").value.trim();
  const tags = document.getElementById("inqTags").value.trim();

  if (!name || !wsuid || !topic || !message) {
    alert("Please fill all required fields.");
    return;
  }

  const inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
  inquiries.push({
    id: Date.now(),
    name, wsuid, topic, message, tags,
    date: new Date().toLocaleString(),
    status: "Open"
  });

  localStorage.setItem("inquiries", JSON.stringify(inquiries));
  closeInquiryModal();
  renderInquiries();
}

// 🔁 Render inquiries
function renderInquiries() {
  const inquiryList = document.getElementById("inquiryList");
  if (!inquiryList) return;

  inquiryList.innerHTML = "";
  const inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");

  inquiries.forEach(inq => {
    const card = document.createElement("div");
    card.classList.add("inquiry-card");
    card.setAttribute("data-id", inq.id);
    card.setAttribute("data-tags", `${inq.name} ${inq.wsuid} ${inq.topic} ${inq.tags}`.toLowerCase());

    card.innerHTML = `
      <div class="status-badge">${inq.status}</div>
      <h3>${inq.name} (${inq.wsuid})</h3>
      <p><strong>Topic:</strong> ${inq.topic}</p>
      <p><strong>Message:</strong> ${inq.message}</p>
      <p class="inquiry-meta">${inq.date}</p>
      ${inq.tags.split(",").map(tag => `<span class="inquiry-tag">#${tag.trim()}</span>`).join("")}
      <div class="inquiry-actions">
        <button onclick="toggleInquiryStatus(${inq.id})">🔁 Toggle Status</button>
        <button onclick="deleteInquiry(${inq.id})">🗑️ Delete</button>
      </div>
    `;

    inquiryList.appendChild(card);
  });
}

// 🗑️ Delete inquiry
function deleteInquiry(id) {
  if (!confirm("Delete this inquiry?")) return;
  let inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
  inquiries = inquiries.filter(inq => inq.id !== id);
  localStorage.setItem("inquiries", JSON.stringify(inquiries));
  renderInquiries();
}

// 🔁 Toggle status
function toggleInquiryStatus(id) {
  let inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
  inquiries = inquiries.map(inq => {
    if (inq.id === id) {
      inq.status = inq.status === "Open" ? "Resolved" : "Open";
    }
    return inq;
  });
  localStorage.setItem("inquiries", JSON.stringify(inquiries));
  renderInquiries();
}

// 🔍 Filter inquiries
function filterInquiries() {
  const search = document.getElementById("inquirySearch").value.toLowerCase();
  const topic = document.getElementById("inquiryTopicFilter").value;
  const cards = document.querySelectorAll(".inquiry-card");

  cards.forEach(card => {
    const tags = card.getAttribute("data-tags");
    const matchesSearch = tags.includes(search);
    const matchesTopic = (topic === "all") || tags.includes(topic.toLowerCase());
    card.style.display = (matchesSearch && matchesTopic) ? "block" : "none";
  });
}
// ============================
// 📢 ALERTS & NOTICES LOGIC
// ============================

// 🟡 Post new alert
function postAlert() {
  const title = document.getElementById("alertTitle").value.trim();
  const message = document.getElementById("alertMessage").value.trim();

  if (!title || !message) {
    alert("Please fill in both title and message.");
    return;
  }

  const alerts = JSON.parse(localStorage.getItem("alerts") || "[]");
  alerts.push({
    id: Date.now(),
    title,
    message,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("alerts", JSON.stringify(alerts));
  document.getElementById("alertTitle").value = "";
  document.getElementById("alertMessage").value = "";
  renderAlerts();
}

// 📄 Render alert list
function renderAlerts() {
  const container = document.getElementById("alertList");
  if (!container) return;

  const alerts = JSON.parse(localStorage.getItem("alerts") || "[]").reverse();
  container.innerHTML = "";

  alerts.forEach(alert => {
    const card = document.createElement("div");
    card.classList.add("alert-card");
    card.innerHTML = `
      <h3>${alert.title}</h3>
      <p>${alert.message}</p>
      <small>Posted on: ${alert.date}</small><br />
      <button onclick="deleteAlert(${alert.id})">🗑️ Delete</button>
    `;
    container.appendChild(card);
  });
}

// 🗑️ Delete alert
function deleteAlert(id) {
  let alerts = JSON.parse(localStorage.getItem("alerts") || "[]");
  alerts = alerts.filter(a => a.id !== id);
  localStorage.setItem("alerts", JSON.stringify(alerts));
  renderAlerts();
}

// 🚀 Auto-run on page load
document.addEventListener("DOMContentLoaded", renderAlerts);
// ============================
// 📊 ANALYTICS MODULE LOGIC
// ============================

// 📈 Chart: Weekly Engagement
function renderEngagementChart() {
  const ctx = document.getElementById("engagementChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{
        label: "Chats",
        data: [65, 89, 58, 120, 91],
        backgroundColor: "#000"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// 📊 Chart: FAQ Usage by Topic
function renderTopicChart() {
  const ctx = document.getElementById("topicChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Admissions", "Housing", "Finance", "Tech", "Other"],
      datasets: [{
        label: "FAQs",
        data: [120, 90, 40, 30, 20],
        backgroundColor: ["#000", "#666", "#999", "#ccc", "#ffcd00"]
      }]
    },
    options: {
      responsive: true
    }
  });
}

// 📊 Run on load
document.addEventListener("DOMContentLoaded", () => {
  renderEngagementChart();
  renderTopicChart();
});
// ============================
// 👥 ADMIN USERS LOGIC
// ============================

function addAdmin() {
  const name = document.getElementById("adminName").value.trim();
  const email = document.getElementById("adminEmail").value.trim();
  const role = document.getElementById("adminRole").value;

  if (!name || !email) {
    alert("Please fill out both name and email.");
    return;
  }

  const admins = JSON.parse(localStorage.getItem("adminUsers") || "[]");

  admins.push({
    id: Date.now(),
    name,
    email,
    role
  });

  localStorage.setItem("adminUsers", JSON.stringify(admins));
  document.getElementById("adminName").value = "";
  document.getElementById("adminEmail").value = "";
  renderAdmins();
}

function renderAdmins() {
  const container = document.getElementById("adminList");
  if (!container) return;

  const admins = JSON.parse(localStorage.getItem("adminUsers") || "[]").reverse();
  container.innerHTML = "";

  admins.forEach(admin => {
    const card = document.createElement("div");
    card.classList.add("admin-card");
    card.innerHTML = `
      <span><strong>${admin.name}</strong> (${admin.role})<br/>📧 ${admin.email}</span>
      <button onclick="deleteAdmin(${admin.id})">🗑️ Remove</button>
    `;
    container.appendChild(card);
  });
}

function deleteAdmin(id) {
  let admins = JSON.parse(localStorage.getItem("adminUsers") || "[]");
  admins = admins.filter(a => a.id !== id);
  localStorage.setItem("adminUsers", JSON.stringify(admins));
  renderAdmins();
}

document.addEventListener("DOMContentLoaded", renderAdmins);
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
}
// ============================
// ⚙️ SETTINGS LOGIC
// ============================

document.addEventListener("DOMContentLoaded", () => {
  // Load theme
  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("themeToggle").checked = theme === "dark";
  document.getElementById("themeLabel").innerText = theme === "dark" ? "Dark Mode" : "Light Mode";

  // Load toggle values
  ["privacyBlur", "compactMode", "devMode"].forEach(id => {
    const checkbox = document.getElementById(id);
    const value = localStorage.getItem(id) === "true";
    checkbox.checked = value;
    applySetting(id, value);
    checkbox.addEventListener("change", () => {
      localStorage.setItem(id, checkbox.checked);
      applySetting(id, checkbox.checked);
    });
  });

  // Theme toggle
  document.getElementById("themeToggle").addEventListener("change", e => {
    const isDark = e.target.checked;
    const newTheme = isDark ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.getElementById("themeLabel").innerText = isDark ? "Dark Mode" : "Light Mode";
  });

  // Load profile
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  if (profile.name) document.getElementById("profileName").value = profile.name;
  if (profile.email) document.getElementById("profileEmail").value = profile.email;
});

// Save profile
function saveProfile() {
  const name = document.getElementById("profileName").value.trim();
  const email = document.getElementById("profileEmail").value.trim();
  localStorage.setItem("profile", JSON.stringify({ name, email }));
  alert("Profile saved!");
}

// Submit feedback
function submitFeedback() {
  const msg = document.getElementById("feedbackText").value.trim();
  if (!msg) return alert("Please enter your feedback.");
  alert("Thanks for your feedback!");
  document.getElementById("feedbackText").value = "";
}

// Apply settings logic
function applySetting(key, value) {
  switch (key) {
    case "privacyBlur":
      document.body.style.filter = value ? "blur(2px) brightness(0.9)" : "";
      break;
    case "compactMode":
      document.body.classList.toggle("compact", value);
      break;
    case "devMode":
      const existing = document.getElementById("devBanner");
      if (value && !existing) {
        const banner = document.createElement("div");
        banner.id = "devBanner";
        banner.innerText = "Developer Mode Enabled";
        banner.style = "position:fixed;bottom:0;left:0;width:100%;background:#000;color:#ffcd00;text-align:center;padding:5px;font-weight:bold;z-index:9999;";
        document.body.appendChild(banner);
      } else if (!value && existing) {
        existing.remove();
      }
      break;
  }
}
function changePassword() {
  const current = document.getElementById("currentPassword").value.trim();
  const newPass = document.getElementById("newPassword").value.trim();
  const confirm = document.getElementById("confirmPassword").value.trim();

  if (!current || !newPass || !confirm) {
    return alert("Please fill in all password fields.");
  }
  if (newPass !== confirm) {
    return alert("New passwords do not match.");
  }

  // Since this is local only, you could store a fake password in localStorage
  const stored = localStorage.getItem("adminPassword") || "admin123";
  if (current !== stored) {
    return alert("Current password is incorrect.");
  }

  localStorage.setItem("adminPassword", newPass);
  alert("Password changed successfully!");
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";
}
/* help and support*/
function submitSupport() {
  const name = document.getElementById("supportName").value.trim();
  const email = document.getElementById("supportEmail").value.trim();
  const message = document.getElementById("supportMessage").value.trim();

  if (!name || !email || !message) {
    return alert("Please fill in all fields.");
  }

  const requests = JSON.parse(localStorage.getItem("helpRequests") || "[]");
  requests.push({
    id: Date.now(),
    name,
    email,
    message,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("helpRequests", JSON.stringify(requests));
  alert("Your support request has been submitted successfully!");

  document.getElementById("supportName").value = "";
  document.getElementById("supportEmail").value = "";
  document.getElementById("supportMessage").value = "";
}
function handleLogout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
