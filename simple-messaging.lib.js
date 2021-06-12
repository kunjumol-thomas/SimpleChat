/*
  Kunjole njan ninne HTML padhippikkan vendi prepare cheitha oru library aanu ithu. ee library upayogikkunnathine njan short aayittu explain cheithu tharum. Pakshe ee file njan ennekkond aavunnathil appuram explain cheith documentation aakkiyittaanu prepare cheithathu.
  Aa effort waste aavanda enn ninakkum thonnunnundengil onn ee thaazhe ulla comments okke vaayichu nokku. Kunnolam thannittu kunnikkuruvolam engilum ninakku kittiyaal ath enikku valare valuable aanu. Njan ninnodu ee file open cheith nokkan parayilla, but ithilokke sherikkum ninakku thalparyam undengil enganeya ee message sherikkum send aavunnath eonnokke curiosity kond nee nokkum. Pandorikkal HTML pagil video cherkkaan pattumo enn chintichu enikk thonniya curiosity pole. Eni athu ninakku thonnunnillengil orupakshe ninakk ee fieldil thalparuam illa. Test your own taste.
 */

/**
 * Function for connecting our app to backend and exchanging messages between users who are connected to the backend
 *
 * @author Jishnu Raj<jishnurajpp2@gmail.com>
 * @version 1.0.0
 */
function setupMessaging(message_container,message_sending_form,message_input_form,message_template_id) {
  /*
    This will connect our front end (The HTML page) to backend server
    running on a cloud virtual machine that I created (Like aws EC2)
  */
  const socket = io("https://my-simple-chat-server.herokuapp.com/");

  /*
    Creating variables in JavaScript that has reference to 
    HTML Tags (also called as elements or nodes) in the webpage
  */
  const messages = $(message_container);
  const messagingForm = $(message_sending_form);
  const messageField = $(message_input_form);
  const messageTemplate = $("#" + message_template_id);

  /*
    Message template is an element in the page that has a template of
    each messages shown in the page.
    Once we make a JavaScript reference to the HTML template element (line 26)
    then we can remove that template as we will be creating new copies of that
    template and inserting into the message container tag whenever a new message
    is sent or received
  */
  messageTemplate.removeAttr("id");
  messageTemplate.remove();

  /*
    Here we listen for the form's submittion event.
    Means whenever the form is submitted sendMessage function will be called
   */
  messagingForm.on("submit", sendMessage);

  /*
    This function will read message from input tag by messageField.val()
    and then emit an event named "send_message" to the server.
    Server is right now waiting for "send_messages" events and once
    it receive any such event, it (server) will immediately broadcast that
    message to all the *other connected users with a new event named "message_received"
  */
  function sendMessage(e) {

    /*
      Usually the action attribute of form tags has a url and when the 
      form is submitted the url is opened.
      e.preventDefault(); will prevent the default behaviour of form 
      submittion which is the page being loaded.
    */
    e.preventDefault();

    // Make a new clone of the message template element
    const messageElement = messageTemplate.clone();

    // Read the text entered in the message input tag and set that 
    // as the content inside the new message element
    messageElement.text(messageField.val());

    /*
      Remember, sendMessage function is called when the current user is sending
      the message. So we should be doing some kind of different styles for sent
      messages and received messages. Like different text color or background.
      Here as the message is being sent (sendMessage) we will dynamically add a
      class "msg-sent" to the newly created message element.
      Later we can give a style to the sent messages in CSS like 
      .msg-sent{
        color: red;
      }
    */
    messageElement.addClass("msg-sent");

    /*
      The above JavaScript code just created a new element (clone of the template),
      put the new message as the text inside that new message element (like a <div></div> tag)
      and added class attribute as class="msg-sent" so far.
      We have created the message for showing in the messages section/container. Now we just 
      have to put it at the end of the message container.
      You should make a container element in the webpage to put all the messages inside it.
      Like:
      <div id="messages"></div>
      and then you will be passing that element's id as the first argument of the setupMessaging 
      function. Then we are taking a JavaScript reference to that HTML element and storing that
      reference in a variable. (check line 23 of this JavaScript file)
      Now we are just appending (Putting at the end of...) the newly created message element to
      the message container box.
     */
    messages.append(messageElement);

    /*
      When the user type a message and submit the form then JavaScript will
      1. Create a clone of the message template
      2. Read the entered message and set that as the text content of the message (line 67)
      3. As the message is benig sent by the user we're adding a new class "msg-sent" to the
          message element (line 80)
      4. Appending that new message element to the messages container tag in the HTML page.

      Now you can see that whenever the user type something in the input box and press the send
      button then that new message will be appended to the messages container for that user. 
      But we are not actually sending it to the other users or to the server.
      The below code will send the new message to the server as "send_message" event. The server 
      is waiting for clients to emit these events and once any user emit a such event, server will
      broadcast it to all the other users.
      When 10 users are currently on the webpage and user x is sending a message to ther server
      then server will broadcast that message to all the connected client users except x.
      That is why we are seperately appending the sent messages to the sender user's webpage on the
      above lines ( line 63, 67, 80, 97 )


      Below line (line 121) will send the message to the server to be broadcasted to all the other users
    */
    socket.emit("send_message", messageField.val());

    /*
      Once the message is sent to the server we need to clear the input message box.
      Think about WhatsApp, you type something, press send and then the message is sent,
      along with that the typed message will be deleted from the input box.

      Below line of code will set the value of input tag as "",
      If you change the below code to messageField.val("xyz"); then when you type something
      and press the send button, the message will be sent and in the input box the typed message
      will be replaced by xyz.
     */
    messageField.val("");
  }

  //----- Finished code for sending message. Let's received messages-----//

  /*
    Read line 10 to 12 of this file.
    Message is sent to the server as "send_message" event and server is waiting for the "send_message"
    event to be sent by the clients. Once server get any new message with the name "send_message", it 
    will forward that message to all the connected users as "message_received" event.
    Below lines of code is waiting for the server to broadcast messages sent by other connected users.
  */
  socket.on("message_received", receiveMessages);

  function receiveMessages(msg){

    /*
      Below line is used to log all the incoming messages to the developer console.
      Developer console is a window where all JavaScript errors are printed.
      console.log("Hello") is just the same like printf("Hello"); in C
      programming language and cout<<"Hello"; in C++

      When you run a C program that print hello to the screen, the code is written
      in Code Blocks and F5 is pressed to see the output. Instead as JavaScript is used
      in websites, Edge / Chrome like web browsers has a special window where you can see
      all these outputs.
      Normally when you open a website you won't see any error outputs or console logs because it is not
      made for normal website visitors, but if you run Ctrl + Shift + I then you'll see a new window and that
      is called THE DevTools. There you'll see an option "Console" and just click over that button and then you
      can see the console logs. Now whenever receive a new message, you'll first see that message in the console window.

      Remember console.log("Hi"); prints "Hi" to the console (Without the double quotes) and console.log(msg); will print
      the message received to the console
    */
    console.log({ received_message: msg });

    /*
      Just like the sendMessage function, here we will
      1. Make a copy of the message template in our HTML
      2. Put the incoming message as the text content of the new message element
      3. Give it a class name class="msg-received" as this message is received from someone else, not sent by current user
      4. Append the new message element to the message container.
    */
    const messageElement = messageTemplate.clone();
    messageElement.text(msg);
    messageElement.addClass("msg-received");
    messages.append(messageElement);
  }
}



/**
 * ************************     THE END     ********************************
 */