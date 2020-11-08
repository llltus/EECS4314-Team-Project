<script>
  export let article;
  let toneScores = [];
  const openArticleLink = () => {
    window.open(article.url, "_blank");
  };
  for (var toneScore in article.tones) {
    if (article.tones.hasOwnProperty(toneScore)) {
      toneScores.push({
        name: toneScore,
        score: article.tones[toneScore].toFixed(2),
      });
      console.log(toneScore + " -> " + article.tones[toneScore]);
    }
  }
</script>

<style>
  .card {
    background-color: var(--card-bg-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    padding: 24px;
    cursor: pointer;
    width: 96%;
    max-width: 720px;
    margin: auto;
    margin-bottom: 24px;
  }
  div.card:hover {
    background: var(--card-hover-color);
  }
  .title {
    color: var(--card-title-color);
    font-weight: 500;
    font-size: 24px;
    text-align: left;
    line-height: 140%;
  }
  .date {
    color: var(--font-color);
    font-weight: 500;
    font-size: 14px;
    text-align: left;
    margin-top: 24px;
  }
  .abstract {
    margin-top: 24px;
    text-align: left;
    line-height: 160%;
  }
  .author {
    margin-top: 24px;
    font-size: 14px;
    font-style: italic;
    text-align: right;
  }
  .tone_scores {
    margin-top: 8px;
  }
  .tone_score {
    text-transform: capitalize;
    display: inline-block;
    background-color: var(--chip-bg-color);
    padding: 7px 12px;
    border-radius: 24px;
    margin: 16px 8px 0px 8px;
    font-size: 13px;
  }

  @media only screen and (max-device-width: 860px) and (-webkit-min-device-pixel-ratio: 1) {
    .card {
      width: 100%;
      max-width: 100%;
    }
  }
</style>

<div class="card" on:click={openArticleLink}>
  <div class="title">{article.title}</div>
  <div class="date">{article.published_date}</div>
  <div class="abstract">{article.abstract}</div>
  <div class="author">- {article.authors}</div>
  <div class="tone_scores">
    {#each toneScores as toneScore}
      <div class="tone_score">{toneScore.name}: {toneScore.score}</div>
    {/each}
  </div>
</div>
