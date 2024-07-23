<svelte:head>
    <title>Cookie Policy</title>
</svelte:head>

<script lang="ts">
  import config from '$config';
</script>

<div class="policy">
    <h1>Cookie Policy</h1>
    <p>Effective Date: 24 July 2024</p>

    <h2>1. Introduction</h2>
    <p>{config.appName} ("we," "us," "our") uses cookies to enhance your experience while using our Service. This Cookie Policy
        explains what cookies are, how we use them, and your choices regarding cookies.</p>

    <h2>2. What Are Cookies</h2>
    Cookies are small text files that are stored on your device when you visit a website. They serve various purposes,
    including remembering your preferences, analyzing site usage, and enabling certain website features.

    <h2>3. How We Use Cookies</h2>
    <p>We use cookies for various reasons:</p>
    <ul>
        <li><strong>Analytics:</strong> We may use cookies to collect anonymous data for analytics purposes, such as
            tracking website usage and performance.
        </li>
    </ul>

    <h2>4. Your Choices Regarding Cookies</h2>
    <p>You have the following options to manage cookies:</p>
    <ul>
        <li><strong>Browser Settings:</strong> You can set your browser to refuse all cookies or to indicate when a
            cookie is being sent. However, if you do not accept cookies, you may not be able to use some parts of our
            Service.
        </li>
        <li><strong>Delete Cookies:</strong> You can delete cookies that are already on your device by clearing your
            browser's cache.
        </li>
    </ul>

    <h2>5. Changes to This Cookie Policy</h2>
    <p>We reserve the right to update this Cookie Policy at any time. We will not notify you directly of any changes. We
        advise you to review this page periodically for any updates. Your continued use of the Service after any changes
        constitutes your acceptance of the new Cookie Policy.</p>

    <h2>6. Contact Us</h2>
    <p>If you have any questions about this Cookie Policy, please contact us at: <a href={'mailto:' + config.contactEmail}>{config.contactEmail}</a>
    </p>
</div>