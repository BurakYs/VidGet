<svelte:head>
    <title>Privacy Policy</title>
</svelte:head>

<script lang="ts">
  import config from '$lib/config';
</script>

<div class="policy">
    <h1>Privacy Policy</h1>
    <p>Effective Date: 29 July 2024</p>

    <h2>1. Introduction</h2>
    <p>
        {config.appName} ("we," "us," "our") values your privacy. This Privacy Policy describes the information we collect from you
        when you use our website and services ("Service").
        By using our Service, you agree to the collection and use of information in accordance with this policy.
    </p>

    <h2>2. Information Collection</h2>
    <p>
        We do not store any personal data.
        However, we may temporarily log your IP address for the purposes of monitoring and preventing abuse of our Service.
    </p>

    <h2>3. Use of Cookies</h2>
    <p>
        Our Service does not use cookies.
    </p>

    <h2>4. Data Sharing and Disclosure</h2>
    <p>
        We do not share your information with any third parties, except as required by law enforcement agencies.
    </p>

    <h2>5. External Links</h2>
    <p>
        Our Service may contain links to external sites that are not operated by us. We have no control over the content
        and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
    </p>

    <h2>6. Media Storage</h2>
    <p>
        For accessibility reasons, we may store some media you download on our server until the server restarts. This temporary storage
        ensures better accessibility and usability of our Service.
    </p>

    <h2>7. Self-Hosting</h2>
    <p>
        You also have the option to self-host the application if you prefer to have full control over your data.
        The source code is available on <a href={config.githubUrl}>GitHub</a>.
    </p>

    <h2>8. Changes to This Privacy Policy</h2>
    <p>
        We reserve the right to update our Privacy Policy at any time. We will not notify you directly of any changes. We
        advise you to review this page periodically for any updates. Your continued use of the Service after any changes
        constitutes your acceptance of the new Privacy Policy.
    </p>

    <h2>9. Contact Us</h2>
    <p>
        If you have any questions about this Privacy Policy, please contact us at: <a href={'mailto:' + config.contactEmail}>{config.contactEmail}</a>
    </p>
</div>
