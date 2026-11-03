module.exports = (appId) => ({
  legacyCompatibilityMessage: '//android.widget.TextView[contains(@text, "This app was built for an older version of Android")]',
  legacyCompatibilityConfirm: 'id=android:id/button1',
  skipOnboarding: 'id=' + appId + ':id/fragment_onboarding_skip_button',
  home: 'android=new UiSelector().className("android.widget.TextView").text("Search Wikipedia")',
  searchEntry: 'android=new UiSelector().className("android.widget.TextView").text("Search Wikipedia")',
  searchInput: 'id=' + appId + ':id/search_src_text',
  resultTitles: 'id=' + appId + ':id/page_list_item_title',
});
