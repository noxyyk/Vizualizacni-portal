async function ChangeLog() {
Swal.fire({
    position: 'center',
    width: "900px",
    html: `
    <style> 
    ul{
        list-style: none; 
        display:contents;
    }    
    </style>
    <h2 id="change-log">Change Log</h2>

    <p><strong>16.10.2022</strong></p>
    <ul>
    <li>Made interface optimal</li>
    <li>only one login/logout button</li>
    </ul>
    <p><strong>15.10.2022</strong></p>
    <ul>
    <li>Updated user interface, react to the screen size</li>
    </ul>
    <p><strong>14.10.2022</strong></p>
    <ul>
    <li>Added response function</li>
    </ul>
    <p><strong>13.10.2022</strong></p>
    <ul>
    <li>Added logo</li>
    <li>Switched GET to POST request</li>
    <li>Save login inside local variable</li>
    <li>Updated logOut and logIn functions</li>
    </ul>
    <p><strong>7.10.2022</strong></p>
    <ul>
    <li>Working Login TEST</li>
    <li>Made communication with frontend to backend</li>
    <li>deployed website using railway (runs on backend)</li>
    <li>removed vercel</li>
    </ul>
    <p><strong>1.10.2022</strong></p>
    <ul>
    <li>Added sweetalerts</li>
    </ul>
    <p><strong>28.9.2022</strong></p>
    <ul>
    <li>make buttons work</li>
    <li>added styles and icons to the buttons and translation on hover</li>
    <li>added navigation bar with buttons 1.(home, changelog,#setup,#about), 2.(login, logout)</li>
    <li>font changed to Poppins, sans-serif</li>
    </ul>
    <p><strong>27.9.2022</strong></p>
    <ul>
    <li>Added Change log</li>
    <li>Added footer</li>
    <li>Added Header</li>
    </ul>
    <p><strong>26.9.2022</strong></p>
    <ul>
    <li>deployed website using vercel</li>
    <li>Created website</li>
    </ul>
    `,
    confirmButtonText:'Great!'
})
}