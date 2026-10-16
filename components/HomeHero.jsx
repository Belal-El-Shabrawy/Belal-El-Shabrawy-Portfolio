import IntroCard from './IntroCard';

// Deliberately a Server Component, and deliberately *outside* HomeClient.
// The 3D scene is a dynamic(ssr:false) import, so anything rendered inside it
// only appears after a ~900KB three.js chunk has downloaded and run. This card
// is in the initial HTML instead: it is on screen while the island is still
// loading, and it is what a crawler or a link preview sees.
//
// The row spans the full width to centre the card, so it lets presses through:
// otherwise the empty space either side of the card swallows them, and pressing
// the sky beside it (where "Press to explore" points) never turns the island.
// The card turns pointer events back on for itself.
const HomeHero = () => {
    return (
        <div className="home-hero pointer-events-none absolute inset-x-0 top-20 sm:top-28 z-10 flex justify-center px-4 transition-opacity duration-500">
            <IntroCard />
        </div>
    );
};

export default HomeHero;
