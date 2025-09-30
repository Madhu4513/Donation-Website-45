document.addEventListener('DOMContentLoaded', function() {
    // ----------- REQUEST HELP PAGE -----------
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const request = {
                id: Date.now(), // unique ID
                type: requestForm.reqType.value,
                description: requestForm.reqDescription.value,
                name: requestForm.reqName.value,
                contact: requestForm.reqContact.value
            };
            const requests = JSON.parse(localStorage.getItem('requests') || '[]');
            requests.push(request);
            localStorage.setItem('requests', JSON.stringify(requests));
            document.getElementById('requestMsg').textContent = "Request submitted!";
            requestForm.reset();
        });
    }

    // ----------- DONATE PAGE -----------
    function displayRequestsForDonation() {
        const requests = JSON.parse(localStorage.getItem('requests') || '[]');
        const list = document.getElementById('requestList');
        list.innerHTML = '';
        if (requests.length === 0) {
            list.innerHTML = '<li>No pending requests.</li>';
        } else {
            requests.forEach(request => {
                const li = document.createElement('li');
                li.textContent = `${request.type}: ${request.description} (by ${request.name}, Contact: ${request.contact})`;
                const btn = document.createElement('button');
                btn.textContent = "Fulfill";
                btn.onclick = function() {
                    showDonateForm(request.id);
                };
                li.appendChild(btn);
                list.appendChild(li);
            });
        }
    }

    function showDonateForm(requestId) {
        const donateSection = document.getElementById('donateSection');
        donateSection.innerHTML = `
            <h3>Provide Donation Details</h3>
            <form id="donateForm">
                <label for="donType">Type of Donation:</label>
                <select name="type" id="donType" required>
                    <option value="">Select</option>
                    <option value="Funds">Funds</option>
                    <option value="Food">Food</option>
                    <option value="Old Clothes">Old Clothes</option>
                    <option value="Other">Other</option>
                </select>
                <label for="donDescription">Description:</label>
                <input type="text" name="description" id="donDescription" required>
                <label for="donator">Your Name:</label>
                <input type="text" name="donator" id="donator" required>
                <button type="submit">Submit Donation</button>
            </form>
            <div id="donateMsg"></div>
        `;
        document.getElementById('donateForm').onsubmit = function(e) {
            e.preventDefault();
            // Save fulfilled donation to history
            const donation = {
                requestId: requestId,
                requestType: document.getElementById('donType').value,
                requestDescription: document.getElementById('donDescription').value,
                donator: document.getElementById('donator').value,
                fulfilledAt: new Date().toLocaleString()
            };
            const donations = JSON.parse(localStorage.getItem('donations') || '[]');
            donations.push(donation);
            localStorage.setItem('donations', JSON.stringify(donations));

            // Remove the matched request
            let requests = JSON.parse(localStorage.getItem('requests') || '[]');
            requests = requests.filter(r => r.id !== requestId);
            localStorage.setItem('requests', JSON.stringify(requests));
            document.getElementById('donateMsg').textContent = "Thank you for fulfilling this request!";
            donateSection.innerHTML = '';
            displayRequestsForDonation(); // Refresh requests
        };
    }

    if (document.getElementById('requestList')) {
        displayRequestsForDonation();
    }

    // ----------- VIEW PAGE -----------
    function displayAllRequests() {
        const requests = JSON.parse(localStorage.getItem('requests') || '[]');
        const list = document.getElementById('allRequestsList');
        list.innerHTML = '';
        if (requests.length === 0) {
            list.innerHTML = '<li>No pending requests.</li>';
        } else {
            requests.forEach(request => {
                const li = document.createElement('li');
                li.textContent = `${request.type}: ${request.description} (by ${request.name}, Contact: ${request.contact})`;
                list.appendChild(li);
            });
        }
    }

    if (document.getElementById('allRequestsList')) {
        displayAllRequests();
    }

    // ----------- HISTORY PAGE -----------
    function displayDonationHistory() {
        const donations = JSON.parse(localStorage.getItem('donations') || '[]');
        const list = document.getElementById('donationHistoryList');
        if (!list) return;
        list.innerHTML = '';
        if (donations.length === 0) {
            list.innerHTML = '<li>No donations have been made yet.</li>';
        } else {
            donations.forEach(donation => {
                const li = document.createElement('li');
                li.textContent = `Donator: ${donation.donator}, Type: ${donation.requestType}, Description: ${donation.requestDescription}, Date: ${donation.fulfilledAt}`;
                list.appendChild(li);
            });
        }
    }
    if (document.getElementById('donationHistoryList')) {
        displayDonationHistory();
    }
});