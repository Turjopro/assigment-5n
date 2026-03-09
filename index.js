const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues"


/* LOGIN */

function login() {

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    if (username === "admin" && password === "admin123") {

        document.getElementById("loginPage").classList.add("hidden")
        document.getElementById("mainPage").classList.remove("hidden")

        loadIssues()

    }

    else {

        alert("Invalid Credentials")

    }

}




/* LOAD ISSUES */

async function loadIssues() {

    document.getElementById("loading").classList.remove("hidden")

    const res = await fetch(API)
    const data = await res.json()

    allIssues = data.data

    updateIssueCount(allIssues)

    displayIssues(allIssues)

    document.getElementById("loading").classList.add("hidden")

}




/* ISSUE COUNT */

function updateIssueCount(issues) {

    document.getElementById("issueCount").innerText =
        issues.length + " Issues"

}




/* DISPLAY ISSUES */

function displayIssues(issues) {

    const container = document.getElementById("issuesContainer")

    container.innerHTML = ""

    issues.forEach(issue => {

        const borderColor =
            issue.status === "open"
                ? "border-green-500"
                : "border-purple-600"


        /* Priority Style */

        let priorityStyle = ""

        if (issue.priority === "HIGH") {
            priorityStyle = "bg-red-100 text-red-500"
        }
        else if (issue.priority === "LOW") {
            priorityStyle = "bg-gray-200 text-gray-600"
        }
        else {
            priorityStyle = "bg-yellow-100 text-yellow-600"
        }


        /* Label Style (FIXED FOR ARRAY) */

        let labelHTML = ""

        issue.labels.forEach(label => {

            if (label === "bug") {

                labelHTML +=
                    `<span class="px-3 py-1 rounded-full bg-red-100 text-red-500 text-xs font-semibold">
                    BUG
                    </span>`
            }

            else if (label === "help wanted") {

                labelHTML +=
                    `<span class="px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs font-semibold">
                    HELP WANTED
                    </span>`
            }

            else if (label === "enhancement") {

                labelHTML +=
                    `<span class="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                    ENHANCEMENT
                    </span>`
            }

        })



        const card = document.createElement("div")

        card.className =
            `bg-white rounded-xl shadow border-t-4 ${borderColor} cursor-pointer overflow-hidden`


        card.innerHTML = `

<div class="p-5">

<div class="flex justify-between items-center mb-3">

<div class="w-[24px] h-[24px] flex items-center justify-center rounded-full text-purple-600">
<img src="./assets/Open-Status.png" alt="">
</div>

<span class="px-4 py-1 rounded-full text-sm font-semibold ${priorityStyle}">
${issue.priority}
</span>

</div>

<h3 class="text-lg font-bold mb-2">
${issue.title}
</h3>

<p class="text-gray-500 text-sm mb-4">
${issue.description}
</p>

<div class="flex gap-2 flex-wrap">
${labelHTML}
</div>

</div>

<div class="border-t p-4 text-sm text-gray-500">

<p>#${issue.id} by ${issue.author}</p>

<p>${new Date(issue.createdAt).toLocaleDateString()}</p>

</div>

`

        card.onclick = () => openModal(issue)

        container.appendChild(card)

    })

}



/* TAB TOGGLE */

function setActiveTab(tab) {

    const tabs = document.querySelectorAll(".tabBtn")

    tabs.forEach(btn => {

        btn.classList.remove("bg-[#4A00FF]", "text-white")

        btn.classList.add("border")

    })

    const activeTab = document.getElementById(tab + "Tab")

    activeTab.classList.add("bg-[#4A00FF]", "text-white")

    activeTab.classList.remove("border")

}




/* FILTER */

function filterIssues(type) {

    setActiveTab(type)

    let filtered = allIssues

    if (type === "open") {

        filtered = allIssues.filter(issue => issue.status === "open")

    }

    if (type === "closed") {

        filtered = allIssues.filter(issue => issue.status === "closed")

    }

    updateIssueCount(filtered)

    displayIssues(filtered)

}




/* SEARCH */

async function searchIssue() {

    const text = document.getElementById("searchInput").value

    const res = await fetch(
        `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
    )

    const data = await res.json()

    updateIssueCount(data.data)

    displayIssues(data.data)

}


/* MODAL */

function openModal(issue) {

    document.getElementById("modal").classList.remove("hidden")

    document.getElementById("modalTitle").innerText = issue.title
    document.getElementById("modalDesc").innerText = issue.description
    document.getElementById("modalAuthor").innerText = issue.author
    document.getElementById("modalAssignee").innerText = issue.assignee
    document.getElementById("modalDate").innerText = issue.createdAt
    document.getElementById("modalPriority").innerText = issue.priority

    const labelsContainer = document.getElementById("modalLabels")
    labelsContainer.innerHTML = ""

    issue.labels.forEach(label => {

        const span = document.createElement("span")

        if (label === "bug") {
            span.className = "bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
        }
        else if (label === "help wanted") {
            span.className = "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
        }

        span.innerText = label.toUpperCase()

        labelsContainer.appendChild(span)
    })
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden")
}