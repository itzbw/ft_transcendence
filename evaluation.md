#Scale for project ft_transcendence

Introduction

- Only grade the work that was turned in the Git repository of the evaluated
student or group.

- Double-check that the Git repository belongs to the student(s). Ensure that
the project is the one expected. Also, check that 'git clone' is used in an
empty folder.

- Check carefully that no malicious aliases was used to fool you and make you
evaluate something that is not the content of the official repository.

- To avoid any surprises and if applicable, review together any scripts used
to facilitate the grading (scripts for testing or automation).

- If you have not completed the assignment you are going to evaluate, you have
to read the entire subject prior to starting the evaluation process.

- Use the available flags to report an empty repository, a non-functioning
program, a Norm error, cheating, and so forth.
In these cases, the evaluation process ends and the final grade is 0,
or -42 in case of cheating. However, except for cheating, student are
strongly encouraged to review together the work that was turned in, in order
to identify any mistakes that shouldn't be repeated in the future.

- Remember that for the duration of the defence, no segfault, no other
unexpected, premature, uncontrolled or unexpected termination of the
program, else the final grade is 0. Use the appropriate flag.
You should never have to edit any file except the configuration file if it
exists. If you want to edit a file, take the time to explicit the reasons
with the evaluated student and make sure both of you are okay with this.

- You must also verify the absence of memory leaks. Any memory allocated on
the heap must be properly freed before the end of execution.
You are allowed to use any of the different tools available on the computer,
such as leaks, valgrind, or e_fence. In case of memory leaks, tick the
appropriate flag.


General instructions

Preliminary tests

    Any credentials, API keys, environment variables must be set inside a .env file during the evaluation. In case any credentials, API keys are available in the git repository and outside of the .env file created during the evaluation, the evaluation stop and the mark is 0.
    Ensure the docker compose file is at the root of the repository.
    Run the "docker-compose up --build" command.
    Since the rating of this project is more flexible, do not stop the evaluation process unless you encounter a 500 error, a crash, or anything that actually doesn't work within the project scope.

Basic checks

    The website is available.
    The user can subscribe on the website.
    Registered users can log in.
    The website is a Single Page Application. The user can use the "Back" and "Forward" buttons of the web browser.
    You can browse the website using the latest version of Chrome.

The website

Security concerns

    Ensure that the website is secured.
    Be carefull about TLS. If there is a backend or any other features, it must be available.
    Check if there is a database the passwords must be hashed.
    Check the server for server-side validation/sanitization on forms and any user input.
    Ensure the security measures are properly implemented and thoroughly tested.
    If there is any error, the evaluation ends now.

The game

Local game

    You should be able to use this game locally on the same computer using the keyboard.
    Each player should be able to utilize a section of the keyboard.
    You must also be able to initiate a tournament, and the tournament should offer a matchmaking system to connect local players.

Gameplay

The game itself must be playable and respect the original Pong game.
The controls must be intuitive or correctly explained (with some rules or
manual). When a game is over, either a kind of end-game screen is
displayed or the game page just exits.

Lags & disconnects

Unexpected disconnections and lags have to be handled. The game and the
website must not crash when a user is experiencing lags or is disconnected.
Handling such issues in an efficient way is appreciated but not mandatory:

    Pause the game for a defined duration.
    Disconnected users can reconnect.
    Lagging users can catch up to the match.
    And so forth. Any solution is acceptable. The only requirement is: the game should not crash.

===

Modules

For this section, it is crucial to thoroughly read the PDF document detailing the requirements for each module, and provide clear and precise explanations for each choice made. In case of any doubt, do not hesitate to stop.


Major module 01 - 07

You must now verify the chosen module(s) with each group participant.
You must comprehensively understand everything that will be explained,
with the subject PDF as your reference. The obligations for each module
are clearly stated in the subject's PDF.

Do not hesitate to ask any questions and request a demonstration of the
proper functioning of these module(s).

As a reminder, one major module is equivalent to 2 minor modules, as specified
in the subject.

A module is considered valid under the following criteria:

    There are no issues with the proper functioning of the presented module(s).
    We understand how it works and why it was chosen.
    No errors are visible
    A comprehensive explanation allows for a detailed understanding of these module(s).

We would like to remind you that this is an important project, and that it is essential
to carry out this evaluation properly.


Bonus

Evaluate the bonus part if, and only if, the mandatory part has been entirely and perfectly done, and the error management handles unexpected or bad usage. In case all the mandatory points were not passed during the defense, bonus points must be totally ignored. 

Extra Module

You must now verify the extra chosen module(s) with each group participant.
You must comprehensively understand everything that will be explained,
with the subject PDF as your reference. The obligations for each module
are clearly stated in the subject's PDF.

Do not hesitate to ask any questions and request a demonstration of the
proper functioning of these module(s).

As a reminder, one major module is equivalent to 2 points. One minor module is
equivalent to 1 point.

A module is considered valid under the following criteria:

    There are no issues with the proper functioning of the presented module(s).
    We understand how it works and why it was chosen.
    No errors are visible
    A comprehensive explanation allows for a detailed understanding of these module(s).

We would like to remind you that this is an important project, and that it is essential
to carry out this evaluation properly.





