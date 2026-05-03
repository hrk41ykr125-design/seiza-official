export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // 新しい Pages のドメインに差し替え
    url.hostname = 'seiza-official.pages.dev';
    
    // 301 恒久的な移動としてリダイレクト
    return Response.redirect(url.toString(), 301);
  },
};
