<script>
	import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    let searchQuery = "";

    const clickSearch = () => document.getElementById("searchButton").click();

    function emitSearchQuery(){
		dispatch('testEmit', searchQuery);
	}
</script>

<input
  class="search-bar"
  bind:value={searchQuery}
  on:keyup={(e) => e.key === 'Enter' && clickSearch()} />
  <button id="searchButton" on:click={emitSearchQuery}>Search</button>