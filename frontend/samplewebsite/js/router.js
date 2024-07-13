const routes = {
	"#aboutus": "/views/aboutus.html",
};

function showAboutUsPage() {
    const aboutUsContainer = document.getElementById('aboutUsContainer');

    // Vérifiez si le contenu est déjà chargé pour éviter de le dupliquer
    if (aboutUsContainer.innerHTML === '') {
        aboutUsContainer.innerHTML = `
            <h2>About Us</h2>
            <p>We are a company dedicated to providing the best services to our customers. Our team is composed of experienced professionals who are passionate about their work.</p>
            <p>Contact us at: contact@company.com</p>
        `;
    }

    // Scroll to the "About Us" section
    aboutUsContainer.scrollIntoView({ behavior: 'smooth' });
}