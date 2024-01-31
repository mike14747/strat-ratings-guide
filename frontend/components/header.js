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
        <nav class="header-right">
            <div class="navdropdown">
                <div class="navdropbtn">Navigation<i class="arrow down"></i></div>
                    <div class="navdropdown-content">
                    <div class="item"><a href="/hitter-analysis">View Hitter Analysis</a></div>
                    <div class="item"><a href="/upload-hitter-data">Upload Hitter Data</a></div>
                    <div class="item"><a href="/upload-multi-team-hitter-data">Upload Multi-Team Hitter Data</a></div>
                    <div class="item"><a href="/pitcher-analysis">View Pitcher Analysis</a></div>
                    <div class="item"><a href="/upload-pitcher-data">Upload Pitcher Data</a></div>
                    <div class="item"><a href="/upload-multi-team-pitcher-data">Upload Multi-Team Pitcher Data</a></div>
                </div>
            </div>
        </nav>
        `;
    }
}

customElements.define('nav-component', NavComponent);
