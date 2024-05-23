const form = document.getElementById('invoice-form');
const itemContainer = document.getElementById('item-container');
const signatureImage = document.getElementById('signature');

document.getElementById('add-item-button').addEventListener('click', () => {
    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = `
                <label>Description:</label>
                <input type="text" class="description-input" required>
                <label>Amount:</label>
                <input type = "number" class = "amount-input" requird>
            `;
    itemContainer.appendChild(itemDiv);
});

form.addEventListener('submit', event => {
    event.preventDefault();

    const invoiceNumber = document.getElementById('invoice-number-input').value;
    const payTo = document.getElementById('pay-to-input').value;
    const address = document.getElementById('address-input').value;
    const phone = document.getElementById('phone-input').value;
    const email = document.getElementById('email-input').value;
    const bank = document.getElementById('bank-input').value;
    const accountName = document.getElementById('account-name-input').value;
    const accountNumber = document.getElementById('account-number-input').value;

    const items = [];
    const descriptions = document.getElementsByClassName('description-input');
    const amounts = document.getElementsByClassName('amount-input');

    for (let i = 0; i < descriptions.length; i++) {
        items.push({
            description: descriptions[i].value,
            amount: parseFloat(amounts[i].value),
        });
    }

    const total = items.reduce((sum, item) => sum + item.amount, 0);


    document.getElementById('invoice-number').innerText = invoiceNumber;
    document.getElementById('pay-to').innerText = payTo;
    document.getElementById('address').innerText = address;
    document.getElementById('phone').innerText = phone;
    document.getElementById('email').innerText = email;
    document.getElementById('bank').innerText = bank;
    document.getElementById('account-name').innerText = accountName;
    document.getElementById('account-number').innerText = accountNumber;

    const invoiceItemsContainer = document.getElementById('invoice-items');
    invoiceItemsContainer.innerHTML = ''; // Clear any existing items
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${item.description}</td>
                    <td>$${item.amount}</td>
                `;
        invoiceItemsContainer.appendChild(row);
    });

    document.getElementById('total').innerText = total.toFixed(2);

    const signatureInput = document.getElementById('signature-input').files[0];
    if (signatureInput) {
        console.log("inside imagess", signatureInput)
        const reader = new FileReader();
        reader.onload = function (e) {
            signatureImage.src = e.target.result;
        };
        reader.readAsDataURL(signatureInput);
    }
});

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const invoice = document.getElementById('invoice');
    const canvas = await html2canvas(invoice, { scale: 3}); // Increase scale for better quality
    const imgData = canvas.toDataURL('image/jpeg');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    const pageHeight = pdf.internal.pageSize.getHeight();

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, "", "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
    }

    pdf.save('invoice.pdf');
}

