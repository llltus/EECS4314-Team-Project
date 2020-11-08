<script>
  export let article;
  const openArticleLink = () => {
    window.open(article.url, "_blank");
  };
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
</style>

<div class="card" on:click={openArticleLink}>
  <div class="title">{article.title}</div>
  <div class="date">{article.published_date}</div>
  <div class="abstract">{article.abstract}</div>
  <div class="author">- {article.authors}</div>
</div>
