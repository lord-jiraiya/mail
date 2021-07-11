document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // document.querySelector('#reply').addEventListener('click',()=>replyMail());
  // document.querySelector('#move-to-archive').addEventListener('click',()=>archive());
  // document.querySelector('#mark-as-unread').addEventListener('click',()=>markUnread());
  document.querySelector('#compose-form').addEventListener('submit',(e)=>sendMail(e));
  
  // By default, load the inbox
  load_mailbox('inbox');

  // element = document.querySelector('#compose-form');
  // element.addEventListener('click',(e)=>{

    
    
  // });

});



function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}





function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  // Show the mailbox name

  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
  // Print emails
  display_mails(emails,mailbox);
  // read_reciept();
  console.log(emails);
  // ... do something else with emails ...
  });

}



function loadMail(mail){
  
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  document.querySelector('#email-from').innerHTML =  mail.sender;
  document.querySelector('#email-to').innerHTML = mail.recipients;
  document.querySelector('#email-subject').innerHTML = mail.subject;
  document.querySelector('#email-timestamp').innerHTML = mail.timestamp;
  document.querySelector('#email-body').innerHTML = mail.body;
  document.querySelector('.email-control').innerHTML = '';
  addEmailControls(mail);


  document.querySelector('#reply').addEventListener('click',()=>replyMail(mail));
  document.querySelector('#mark-as-unread').addEventListener('click',()=>markUnread(mail.id));
  if(email.archived==true)
    document.querySelector('#move-from-archive').addEventListener('click',() => unarchive(mail.id));  
  else
    document.querySelector('#move-to-archive').addEventListener('click',() => archive(mail.id));

}



function display_mails(emails,mailbox){
  for(email of emails){
      document.querySelector('#emails-view').append(email_wrapper(email,mailbox)); 

  }
}

function email_wrapper(email,mailbox){

  //Parent and Child divs
  const element = document.createElement('div');
  const sender = document.createElement('div');
  const subject = document.createElement('div');
  const timestamp = document.createElement('div');

  //defining Class Name
  element.className='email-preview';
  sender.className='sender';
  subject.className='subject';
  timestamp.className='timestamp';

  //Puting Data
  subject.innerHTML = email.subject;
  timestamp.innerHTML = email.timestamp;
  if(mailbox=='sent')
    sender.innerHTML = email.recipients[0];
  else
    sender.innerHTML = email.sender;

    //Appending Child to Parent

  element.appendChild(sender);
  element.appendChild(subject);
  element.appendChild(timestamp);
    
  
  // Event Listener On Click
  element.addEventListener('click',()=>{
    element.style.backgroundColor='#EEEEDD';
    fetchMail(email.id);
  });
  
  //Read vs Unread Mails

  if(email.read == true)
    element.style.backgroundColor = '#EEEEDD';  
  
  
    return element;

}




function markUnread(mail_id){
  console.log(mail_id);
  fetch(`/emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: false
    })
  });

}
function markRead(mail_id){
  console.log(mail_id);
  fetch(`/emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}

function archive(mail_id){
  
  fetch(`/emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  });
  
  alert('Added To Archive');

}

function unarchive(mail_id){
  
  fetch(`/emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  });
  
  alert('Moved from Archive');

}


function fetchMail(mail_id){
  markRead(mail_id);
  
  fetch(`/emails/${mail_id}`)
  .then(response => response.json())
  .then(email => {
    loadMail(email);
  });

}
function replyMail(mail){
  compose_email();
  document.querySelector('#compose-recipients').value = mail.sender;
  document.querySelector('#compose-subject').value = `Re: ${mail.subject}`;
  document.querySelector('#compose-body').value = `On ${mail.timestamp} ${mail.sender} wrote: \n ${mail.body} \n .... \n `;

};


function sendMail(e){

  // alert('Hello');
  e.preventDefault();
  
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
    recipients: document.querySelector('#compose-recipients').value,
    subject: document.querySelector('#compose-subject').value,
    body: document.querySelector('#compose-body').value
    })
    })
    .then(response => response.json())
    .then(result => {
    // Print result
    if(result.status == 201){
      console.log(result);
      alert(' Email Sent.');
      
      load_mailbox('sent');
    }
    else
      alert(result.error);
    });


}

function addEmailControls(mail){
  const reply = document.createElement('div');
  reply.className ='btn btn-sm btn-outline-primary';
  reply.id = 'reply';
  reply.innerHTML = 'Reply';

  let archive = document.createElement('div');
  archive.className = 'btn btn-sm btn-outline-primary';
  archive.id = 'move-to-archive' ;
  archive.innerHTML = 'Archive';

  let unarchive = document.createElement('div');
  unarchive.className = 'btn btn-sm btn-outline-primary';
  unarchive.id = 'move-from-archive' ;
  unarchive.innerHTML = 'Un-archive';



  let unread = document.createElement('div');
  unread.className = 'btn btn-sm btn-outline-primary';
  unread.id = 'mark-as-unread';
  unread.innerHTML = 'Mark Unread';
  let parent = document.querySelector('.email-control');
  parent.append(reply);
  if(mail.archived==true)
    parent.append(unarchive);
  else
    parent.append(archive);
  parent.append(unread);

}
