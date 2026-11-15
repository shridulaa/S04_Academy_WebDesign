// S04 Academy - Task 4 JavaScript Feature
// Feature: Course Fee Estimator & Registration Form Handling with Validation, DOM updates, and Local Storage.

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements Selection
    const demoForm = document.querySelector('.demo-form');
    const batchSelect = document.getElementById('batch-select');
    const formSection = document.getElementById('enroll');

    // Dynamically insert Fee Estimator Preview UI into DOM (DOM Updates)
    const feePreviewCard = document.createElement('div');
    feePreviewCard.id = 'fee-estimator-preview';
    feePreviewCard.className = 'fee-card';
    feePreviewCard.style.marginTop = '1.5rem';
    feePreviewCard.style.padding = '1rem';
    feePreviewCard.style.backgroundColor = '#F1F5F9';
    feePreviewCard.style.borderRadius = '6px';
    feePreviewCard.style.border = '1px solid #CBD5E1';
    feePreviewCard.style.display = 'none'; // Hidden by default
    feePreviewCard.innerHTML = `
        <h4 style="margin-top:0; color:#1E3A8A;">Estimated Tuition Fee Preview</h4>
        <p id="fee-details" style="margin-bottom:0.5rem; font-weight:500;"></p>
        <small style="color:#64748B;">*Scholarships up to 40% available via S04 Academy Admission Test.</small>
    `;
    formSection.appendChild(feePreviewCard);

    // Fee Structure Data Dictionary
    const feeStructure = {
        'early-bird': { name: 'Early Bird Pre-Foundation', fee: '₹45,000 / year', duration: 'Weekend Classes' },
        'grade-11': { name: '11th Grade Foundation (2-Year)', fee: '₹1,20,000 / year', duration: '4 Days / Week' },
        'grade-12': { name: '12th Grade Target (1-Year)', fee: '₹1,10,000 / year', duration: '4 Days / Week + Board Prep' },
        'dropper': { name: 'Dropper Rank Booster', fee: '₹1,35,000 / year', duration: 'Daily 6-Hour Intensive' }
    };

    // 2. Real-time DOM Update & Local Storage Reading
    if (batchSelect) {
        // Load saved selection from Local Storage if present
        const savedBatch = localStorage.getItem('s04_selected_batch');
        if (savedBatch && feeStructure[savedBatch]) {
            batchSelect.value = savedBatch;
            updateFeePreview(savedBatch);
        }

        // Add Event Listener for batch selection change
        batchSelect.addEventListener('change', (e) => {
            const selectedVal = e.target.value;
            if (selectedVal && feeStructure[selectedVal]) {
                // Save choice to Local Storage
                localStorage.setItem('s04_selected_batch', selectedVal);
                // Dynamically update DOM
                updateFeePreview(selectedVal);
            } else {
                feePreviewCard.style.display = 'none';
                localStorage.removeItem('s04_selected_batch');
            }
        });
    }

    function updateFeePreview(batchKey) {
        const info = feeStructure[batchKey];
        const feeDetailsElem = document.getElementById('fee-details');
        feeDetailsElem.innerHTML = `Selected Track: <strong>${info.name}</strong><br>Estimated Fee: <span style="color:#F97316; font-size:1.1rem; font-weight:700;">${info.fee}</span> (${info.duration})`;
        feePreviewCard.style.display = 'block';
    }

    // 3. Form Validation, Local Storage Writing & Submission Handling
    if (demoForm) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const selectedBatch = batchSelect.value;
            const demoDate = document.getElementById('demo-date').value;

            // Form Validation Checks
            if (fullname.length < 3) {
                alert('Please enter a valid full name (at least 3 characters).');
                return;
            }

            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid 10-digit mobile phone number.');
                return;
            }

            if (!selectedBatch) {
                alert('Please select a target batch.');
                return;
            }

            // Object to store in Local Storage
            const registrationData = {
                fullname,
                email,
                phone,
                selectedBatch: feeStructure[selectedBatch].name,
                demoDate,
                submittedAt: new Date().toLocaleString()
            };

            // Save object as JSON string in Local Storage
            localStorage.setItem('s04_last_registration', JSON.stringify(registrationData));

            // DOM Update: Replace form with confirmation UI card
            demoForm.innerHTML = `
                <div style="text-align: center; padding: 2rem; background-color: #DCFCE7; border-radius: 8px; border: 1px solid #86EFAC;">
                    <h3 style="color: #166534; margin-top: 0;">Registration Successful! 🎉</h3>
                    <p style="color: #15803D;">Thank you <strong>${fullname}</strong>! Your demo class for <strong>${feeStructure[selectedBatch].name}</strong> is scheduled for <strong>${demoDate}</strong>.</p>
                    <p style="font-size: 0.9rem; color: #166534;">We have saved your booking details locally and sent a confirmation to <strong>+91 ${phone}</strong>.</p>
                </div>
            `;
        });
    }
});