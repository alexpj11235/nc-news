exports.formatDates = list => {
  let newList = [...list];
  newList.forEach(entry => {
    entry.created_at = new Date(entry.created_at);
  });
  return newList;
};

exports.makeRefObj = list => {
  let refObj = {};
  list.forEach(article => {
    refObj[article.title] = article.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  let formattedComments = [];
  comments.forEach(comment => {
    let formattedCom = {};
    formattedCom.body = comment.body;
    formattedCom.author = comment.created_by;
    formattedCom.created_at = new Date(comment.created_at);
    formattedCom.votes = comment.votes;
    formattedCom.article_id = articleRef[comment.belongs_to];
    formattedComments.push(formattedCom);
  });
  return formattedComments;
};
