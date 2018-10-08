/* eslint line-break-style: 0, comma-dangle: 0 */
const paraNewLine = `\n\n`;
const myGitAvatar = "https://avatars3.githubusercontent.com/u/2700662?s=400&v=4";
let emails;
let init = false;
const composeBtn = document.querySelector('#compose');
const main = document.querySelector('#main');
// Named my local storage key lab4Emails3095 so it would be unique,
// 3095 is the last 4 digits of my studnet number
// Checks if there is a local copy of emails if not then creates one
if (!localStorage.getItem('lab4Emails3095')) {
    console.log(`Emails don't exist in Local Storage`);
    fetch('https://my.api.mockaroo.com/email.json?key=6e4ecfc0')
    .then((response) => response.json())
    .then((data) => {
        localStorage.setItem('lab4Emails3095', JSON.stringify(data));
        console.log(`Saved emails to Local Storage`);
        renderEmails();
    });
} else {
    renderEmails();
}


function renderEmails(emails) {
    const list = document.querySelector('#list');
    // Initializes the emails by parsing the string saved in local storage
    // Inside conditional so it doesn't overwrite after emails have been selected
    if (!init) {
        emails = JSON.parse(localStorage.getItem('lab4Emails3095'));
        init = true;
    }
    const HtmlSnippet = emails.map((email, index) => `
        <div data-index=${index} class="email-item pure-g ${email.selected ? 'email-item-selected' : ''}">
            <div class="pure-u">
                <img width="64" height="64" alt="${email.name}&#x27;s avatar" class="email-avatar" src="${email.pic}">
            </div>

            <div class="pure-u-3-4">
                <h5 class="email-name">${email.name}</h5>
                <h4 class="email-subject">${email.subject}</h4>
                <p class="email-desc">
                    ${email.body.slice(0, (email.body.indexOf(paraNewLine)))}
                </p>
            </div>
        </div>`
    ).join('');

    list.innerHTML = HtmlSnippet;

    // Grab all the newly rendered emails into an array
    const emailList = [...document.querySelectorAll('.email-item')];
    emailList.map(email => {
        email.addEventListener('click', function() {
            // When an email is clicked make all emails not selected
            emails.forEach(element => {
                element.selected = false;
            });
            // Make the clicked email selected
            emails[this.dataset.index].selected = true;
            // Re-render the emails
            renderEmails(emails);
        })
    })
}

composeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    main.innerHTML = `
    <form name="newEmail" class="pa4 black-80">
        <div>
            <img id="avatar" src="${myGitAvatar}" width="80" height="80" alt="Profile Picture" />
        </div>
        <div>
            <label for="from" class="f6 b db mb2">From</label>
            <input type="text" name="from" id="from" required class="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2" aria-describedby="comment-desc"/>
        </div>
        <div>
            <label for="subject" class="f6 b db mb2">Subject</label>
            <input type="text" name="subject" id="subject" required class="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2" aria-describedby="comment-desc"/>
        </div>
        <div>
        <label for="body" class="f6 b db mb2">Email Body</label>
            <textarea id="body" rows="10" name="body" class="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2" aria-describedby="comment-desc">Hello Joel,</textarea>
        </div>
        <button id="send" class="f6 link dim br1 ph3 pv2 mb2 dib white bg-dark-blue">Send</button>
    </form>
    `;
    
    const sendBtn = document.querySelector('#send');
    const avatar = document.querySelector('#avatar');
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        emails = JSON.parse(localStorage.getItem('lab4Emails3095'));
        emails.unshift({"name":`${document.forms.newEmail.from.value}`, "pic":`${avatar.src}`, "subject":`${document.forms.newEmail.subject.value}`, "email":``, "time":``, "date":``, "body":`${document.forms.newEmail.body.value}`});
        localStorage.setItem('lab4Emails3095', JSON.stringify(emails));
        renderEmails(emails);
    })
});