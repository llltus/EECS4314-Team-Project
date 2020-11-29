<script>
  import Log from "../components/Log.svelte";

  //function to fetch REST API for processed logs
  const fetchLogs = async () => {
    const response = await fetch("http://18.206.238.196:5050/logs");

    if (!response.ok) {
      throw `Error occured: ${response.status}`;
    }

    const responseJson = await response.json();
    return responseJson;
  };

  let allLogs = [];
  let filteredLogs = [];

  //fetch logs async
  fetchLogs().then((logs) => {
    logs.forEach((log) => (allLogs = [...allLogs, log]));
    console.log(allLogs[0]);
    filteredLogs = allLogs;
  });
</script>

<style>
  .empty-list-card {
    background-color: var(--card-bg-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    padding: 24px;
    cursor: pointer;
    width: 96%;
    max-width: 720px;
    margin: auto;
    margin-bottom: 24px;
    font-style: italic;
  }
  @media only screen and (max-device-width: 860px) and (-webkit-min-device-pixel-ratio: 1) {
    .empty-list-card {
      width: 100%;
      max-width: 100%;
    }
  }
</style>

{#if allLogs.length == 0}
  <div class="empty-list-card">- No system logs found -</div>
{:else}
  {#each filteredLogs.reverse() as log}
    <Log {log} />
  {/each}
{/if}
