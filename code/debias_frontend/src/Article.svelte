<script>
  export let article;
  const openArticleLink = () => {
    window.open(article.url, "_blank");
  };
</script>

<p>
  {article.title}
  -
  {article.published_date}
  <br />
  {article.abstract}
  <br />
  -
  {article.authors}
</p>
<button on:click={openArticleLink}>Open</button>
