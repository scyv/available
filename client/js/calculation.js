import { SessionProps } from "./sessionProperties"


export function sumAvailabilities(sprintId) {
    return Availabilities.find({ sprintId })
        .fetch()
        .reduce((pre, av) => (Math.abs(pre) + Math.abs(av.availability)), 0);
}

export function updateAverageVelocity(sprintId, averageVelocity) {
    Sprints.update({ _id: sprintId }, { $set: { averageVelocity: averageVelocity } }, (err) => {
        if (err) {
            console.warn(err);
        }
    });
}

export function updateVelocityWindow(sprintId, velocityWindow) {
    Sprints.update({ _id: sprintId }, { $set: { velocityWindow: velocityWindow } }, (err) => {
        if (err) {
            console.warn(err);
        }
    });
}

export function calculatePossibleStoryPoints(sprint) {
    let sumVelocity = 0;
    let count = 0;
    let velocityWindow = sprint.velocityWindow;
    let collectedSprints = [];
    let velocityWindowIndex = 3;
    const project = Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
    Sprints.find({ stop: { $lt: sprint.start } }, { sort: { start: -1 } }).forEach((otherSprint) => {
        if (otherSprint.burnedSPs > 0) {
            if (velocityWindow) {
                if (velocityWindow.indexOf(otherSprint._id) < 0) {
                    return;
                }
            } else {
                if (velocityWindowIndex-- <= 0) {
                    return;
                }
                collectedSprints.push(otherSprint._id);
            }
            if (otherSprint.fixedPlanning) {
                sumVelocity += otherSprint.burnedSPs / otherSprint.fixedPlanning;
                count++;
            } else {
                const availabilities = sumAvailabilities(otherSprint._id);
                if (availabilities > 0) {
                    const otherSprintVelo = otherSprint.burnedSPs / ((availabilities / project.hoursPerDay) * otherSprint.averageVelocity);
                    sumVelocity += otherSprintVelo;
                    count++;
                }
            }
        }
    });
    if (count == 0) {
        sumVelocity = 1;
        count = 1;
    }
    const averageVelocity = sumVelocity / count;
    if (!velocityWindow) {
        updateVelocityWindow(sprint._id, collectedSprints);
    }
    if (sprint.averageVelocity !== averageVelocity) {
        updateAverageVelocity(sprint._id, averageVelocity);
    }
    return {
        velocity: averageVelocity,
        possibleSP: sprint.fixedPlanning ? sprint.fixedPlanning : (averageVelocity * sumAvailabilities(sprint._id) / project.hoursPerDay),
        fixed: sprint.fixedPlanning ? true : false
    };
}