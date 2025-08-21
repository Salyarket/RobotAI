<script>
  import './reset.css'
  import './app.css'
  import SvelteMarkdown from 'svelte-markdown'
  import PocketBase from 'pocketbase'
  const pb = new PocketBase('http://localhost:8090');

  import { onMount } from 'svelte';

  let messages = $state([]);
  let newMessage = $state("");
  let conversations = [];
  let allConversations = $state([]);
  let title = "";
  let activeConversationId = null;

  let storageMessages = $state({
    content: "",
    is_ai_response: false,
});

  let apiKey = "TjA01v8CDwWlPc88EwgqVkSBkDIaSkIs";
  localStorage.setItem("apiKey", apiKey)

  onMount(() => {
    apiKey = localStorage.getItem("apiKey");
  });

  async function sendRequest() {
    if (!newMessage.trim()) return;

    messages = [...messages, { sender: 'user', text: newMessage }];
    await messageUsertoPocketbase(newMessage, false, activeConversationId);

    try {
      const response = await fetch(
        "https://api.mistral.ai/v1/chat/completions",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: newMessage }],
            model: "mistral-small-latest"
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiMessage = (data.choices[0].message.content);

        messages = [...messages, { sender: 'ai', text: aiMessage }];
        await messageUsertoPocketbase(aiMessage, true, activeConversationId);

      } else {
        console.error("Error request:", response.statusText);
      }
    } catch (error) {
      console.error("Error network:", error);
    }
    newMessage = "";
  }
  const messageUsertoPocketbase = async (content, isAI = false, conversationID = null) => {
   
    await fetch(
       "http://localhost:8090/api/collections/messages_pb/records",
       {
         method: 'POST',
         headers: {
          'Content-Type': 'application/json',
         },
        body: JSON.stringify({content, 
          is_ai_response: isAI,
          ...(conversationID && { conversation: conversationID }) 
        })
      }
    );
 }
  const createConversation = async () => {
   const response = await fetch(
      "http://localhost:8090/api/collections/conversations_pb/records",
      {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        },
       body: JSON.stringify({ title: newMessage }),
     }
   );
    const data = await response.json();
    activeConversationId = data.id;

   loadConversations();
   await sendRequest();
}
function handleKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // pour éviter le saut de ligne
    createConversation();   // ou sendRequest(), selon ce qu'on veut déclencher
  }
}
const loadConversations = async () => {
    const conversations = await fetch(
       "http://localhost:8090/api/collections/conversations_pb/records",
       {
         method: 'GET',
      }
    );
    const data = await conversations.json();
    allConversations = (data.items);
 }
 const loadMessagesByConversation = async (id) => {
    const response = await fetch(
       `http://localhost:8090/api/collections/messages_pb/records?filter=(conversation='${id}')`,
       {
         method: 'GET',
      }
    );
    const data = await response.json();
    messages = data.items.map(item => ({
      sender: item.is_ai_response ? 'ai':'user', 
      text: item.content}
    ));
    }
    const deleteConversation = async (id) => {
      const response = await fetch(
       `http://localhost:8090/api/collections/conversations_pb/records/${id}`,
       {
         method: 'DELETE',
      }
    );
    await loadConversations();
    }  
</script>

<header>
  <div class="bandeau">
    <img src="./Logo.png" alt="logo"/>
  </div>
</header>

<main>
  <section class="sidebar">
      <div class="title">Conversations</div>
      
      {#each allConversations as allConversation (allConversation.id)}
      <div class="tag">
        <span onclick={() => loadMessagesByConversation(allConversation.id)}>
          {allConversation.title}</span>

        <button onclick={() => deleteConversation(allConversation.id)}>X</button>
      </div>
      {/each}

    <div class="create-conv">
      <textarea bind:value={newMessage} placeholder="Posez votre question" rows="1" autocomplete="off" onkeydown={handleKeydown}></textarea>
      <button class="create" onclick={() => createConversation()}>Créer</button>
    </div>
  </section>

  <section class="chat-area">
    {#each messages as message (message.text)}
      <div class="message">
        <div class={message.sender === 'user' ? 'user' : 'ai'}>
          <div class="markdown-body">
            <SvelteMarkdown source={message.text} />
          </div>
          <div class="timestamp">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    {/each}
  </section>
</main>

<style>
 
</style>
