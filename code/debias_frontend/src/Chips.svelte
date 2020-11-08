<script>
  export let tones;
  export let group;
</script>

{#each tones as tone}
  <input
    class="chip"
    type="checkbox"
    bind:group
    name={tone.name.toLowerCase()}
    value={tone.name.toLowerCase()}
    id={tone.name.toLowerCase()} />
  <label
    style="color: {tone.color}"
    for={tone.name.toLowerCase()}>{tone.name}</label>
{/each}
