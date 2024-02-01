class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <header class="header">
            <div class="header-left">
                <div>
                    <img src="analyze.png" />
                </div>
                    
                <div>
                    <p class="heading-text">
                        <sup>Strat</sup> <a href="/">Ratings Guide</a> <sup>Analysis</sup>
                    </p>
                </div>
            </div>
            
            <nav-component></nav-component>
        </header>
        `;
    }
}

customElements.define('header-component', HeaderComponent);

class NavComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <nav class="dropdown">
            <button class="dropbtn">Navigation<i class="down"></i></button>
            <ul class="dropdown-content dropdown-content-nav">
                <a href="/hitter-analysis"><li>View Hitter Analysis</li></a>
                <a href="/upload-hitter-data"><li>Upload Hitter Data</li></a>
                <a href="/upload-multi-team-hitter-data"><li>Upload Multi-Team Hitter Data</li></a>
                <a href="/pitcher-analysis"><li>View Pitcher Analysis</li></a>
                <a href="/upload-pitcher-data"><li>Upload Pitcher Data</li></a>
                <a href="/upload-multi-team-pitcher-data"><li>Upload Multi-Team Pitcher Data</li></a>
        </nav>
        `;
    }
}

customElements.define('nav-component', NavComponent);
