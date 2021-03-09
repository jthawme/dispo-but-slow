# Dispo

This is a goof like usual, its trying to recreate the core essence of the [app 'Dispo'](https://apps.apple.com/us/app/dispo-live-in-the-moment/id1491684197). Dispo is an app like many others that converts your phone images into 35mm looking images, they do it nicely and everyone is excited about it. One of the added interests to it, is that when you take your photos you can't see them until they 'develop' the next day – again a lovely touch.

So **Dispo-but-slow** promises to not let you see your photos for at LEAST 1 week (more akin to real photo development services).

## Running

This is built with next.js so just do `yarn install` and `yarn dev` to run the project. It does however use AWS lambda and dynamodb for the backend of the project, but the `serverless.yml` file is also in this project.

## Disclaimer

The code is messy and maybe I'll tidy it up at some point, but its also fairly lightweight as codebases go so hopefully you can find your way around.

The cool part about this and I would hazard a guess this is what Dispo does too, is that the actual modification of the images to look like 35mm, takes seconds (admittedly my modification is a lot more remedial, but so is the code probably) so actually as soon as you take the photo it makes it into the vintage-feeling images, then it stores these already converted into s3. The waiting is purely a gimmick.

See the `takePhoto` function in `components/CameraPage/index.tsx` to see that in action.
