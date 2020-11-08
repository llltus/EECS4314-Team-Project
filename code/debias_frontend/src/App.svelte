<script>
  import { each, is_empty } from "svelte/internal";
  import Article from "./Article.svelte";
  import SearchBar from "./SearchBar.svelte";
  import Chips from "./Chips.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

  //function to fetch REST API for processed articles
  const fetchArticles = async () => {
    const response = await fetch("http://3.85.125.119:5050/articles");

    if (!response.ok) {
      throw `Error occured: ${response.status}`;
    }

    const responseJson = await response.json();
    return responseJson.articles;
  };

  let allArticles = [];
  let queriedArticles = [];
  let filteredArticles = [];
  let toneFilters = [];
  let tones = [
    { name: "Anger", color: "#E80521" },
    { name: "Fear", color: "#325E2B" },
    { name: "Joy", color: "#FFD629" },
    { name: "Sadness", color: "#086DB2" },
    { name: "Analytical", color: "#075CD8" },
    { name: "Confident", color: "#592684" },
    { name: "Tentative", color: "#1AE5CD" },
  ];

  //fetch articles async
  fetchArticles().then((articles) => {
    articles.forEach((article) => (allArticles = [...allArticles, article]));
    queriedArticles = allArticles;
  });

  function queryArticles(event) {
    queriedArticles = [];
    allArticles.forEach((a) => {
      for (var i = 0; i < a.keywords.length; i++) {
        if (a.keywords[i].toLowerCase().includes(event.detail.toLowerCase())) {
          queriedArticles = [...queriedArticles, a];
          break;
        }
      }
    });
    filteredArticles = [];
    filteredArticles = [...filteredArticles, queriedArticles];
  }

  $: console.log(toneFilters);

  //reactive tone filtering
  $: filteredArticles = queriedArticles
    .filter((article) => {
      let matches = false;
      if (toneFilters.length == 0) {
        return true;
      } else {
        toneFilters.forEach((toneFilter) => {
          if (article.tones.hasOwnProperty(toneFilter)) {
            matches = true;
          }
        });
        return matches;
      }
    })
    //reactive tone sorting (total score method)
    .sort((a1, a2) => {
      let a1Score = 0;
      let a2Score = 0;
      toneFilters.forEach((tone) => {
        if (a1.tones.hasOwnProperty(tone.toLowerCase())) {
          a1Score += a1.tones[tone.toLowerCase()];
        }
        if (a2.tones.hasOwnProperty(tone.toLowerCase())) {
          a2Score += a2.tones[tone.toLowerCase()];
        }
      });
      return parseFloat(a2Score) - parseFloat(a1Score);
    });
</script>

<style>
</style>

<!-- HTML Template -->

<ThemeToggle />

<SearchBar on:testEmit={queryArticles} />
<br />
<Chips {tones} bind:group={toneFilters} />
<br />
{#if allArticles.length == 0}
  <p style="background: red;">Empty list</p>
{:else}
  {#each filteredArticles as article}
    <Article {article} />
  {/each}
{/if}
