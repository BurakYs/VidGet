<style>
    .skeleton-loader {
        display: flex;
        width: 100%;
        max-width: 50rem;
        background-color: #1f1f27;
        border-radius: 0.5rem;
        padding: 1rem;
    }

    .skeleton-image {
        width: 33.33%;
        height: 18rem;
        background-color: #3d3d3d;
        border-radius: 0.5rem;
    }

    .skeleton-details {
        width: 66.67%;
        padding-left: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .skeleton-line {
        height: 1.5rem;
        background-color: #3d3d3d;
        border-radius: 0.25rem;
        margin-bottom: 0.5rem;
    }

    .skeleton-username {
        width: 50%;
        height: 2rem;
        background-color: #3d3d3d;
        border-radius: 0.25rem;
        margin-bottom: 1rem;
    }

    .skeleton-stats {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .skeleton-stat {
        width: 20%;
        height: 1.5rem;
        background-color: #3d3d3d;
        border-radius: 0.25rem;
    }

    @keyframes pulse {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            opacity: 1;
        }
    }

    .skeleton-loader * {
        animation: pulse 1.5s infinite;
    }
</style>

<div class="skeleton-loader">
    <div class="skeleton-image"></div>
    <div class="skeleton-details">
        <div class="skeleton-username"></div>
        <div class="skeleton-line" style="width: 90%;"></div>
        <div class="skeleton-line" style="width: 80%;"></div>
        <div class="skeleton-line" style="width: 70%;"></div>
        <div class="skeleton-stats">
            <div class="skeleton-stat"></div>
            <div class="skeleton-stat"></div>
            <div class="skeleton-stat"></div>
            <div class="skeleton-stat"></div>
        </div>
    </div>
</div>