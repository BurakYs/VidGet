<svelte:head>
    <title>Terms of Service</title>
</svelte:head>

<script lang="ts">
  import config from '$config';
</script>


<div class="policy">
    <h1>Terms of Service</h1>
    <p>Effective Date: 29 July 2024</p>
    <p>
        By using {config.appName}, you agree to these Terms and acknowledge that you have read and understood our Terms of Service.
    </p>

    <h2>1. Acceptance of Terms</h2>
    <p>
        By accessing or using {config.appName} ("we," "us," "our"), you agree to be bound by these Terms of Service ("Terms").
        If you disagree with any part of the terms, you may not access the Service.</p>

    <h2>2. Use of Service</h2>
    <p>
        {config.appName} allows you to download videos and photos from various platforms.
        You agree not to use {config.appName} for any unlawful purposes or to abuse the Service in any way.
    </p>

    <h2>3. Restrictions</h2>
    <p>
        You are prohibited from scraping {config.appName} itself. Any attempt to access or interfere with {config.appName}’s systems, other
        than as expressly permitted by these Terms, is strictly forbidden.</p>
    <p>
        You may not use {config.appName} to download videos or photos that you do not have the right to download.
    </p>

    <h2>4. External Links</h2>
    <p>
        Our Service may include links to external websites that are not provided or maintained by us. We do not
        endorse and are not responsible for the content or practices of these websites.
    </p>

    <h2>5. Termination of Service</h2>
    <p>
        We reserve the right to terminate or suspend the Service at any time without prior notice. You agree that we
        will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
    </p>

    <h2>6. Changes to Terms</h2>
    <p>
        We reserve the right to revise these Terms at any time. We will not notify you directly of any changes. It is
        your responsibility to check this page periodically for updates. Your continued use of the Service after any
        changes constitutes your acceptance of the new Terms.
    </p>

    <h2>7. Contact Us</h2>
    <p>
        If you have any questions about these Terms, please contact us at: <a href={'mailto:' + config.contactEmail}>{config.contactEmail}</a>
    </p>
</div>