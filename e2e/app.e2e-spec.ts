import { PointsRendererPage } from './app.po';

describe('points-renderer App', function() {
  let page: PointsRendererPage;

  beforeEach(() => {
    page = new PointsRendererPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
