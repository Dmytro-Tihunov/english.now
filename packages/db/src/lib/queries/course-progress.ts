import { and, eq } from "drizzle-orm";
import { db } from "../db.js";
import { course, unit, lesson, userCourseProgress, userUnitProgress, userLessonProgress } from "../schema/index.js";

export type CourseWithProgress = {
    course: typeof course.$inferSelect;
    progress: {
        courseProgress: typeof userCourseProgress.$inferSelect | null;
        unitProgress: (typeof userUnitProgress.$inferSelect & {
            unit: typeof unit.$inferSelect;
        })[];
        lessonProgress: (typeof userLessonProgress.$inferSelect & {
            lesson: typeof lesson.$inferSelect;
        })[];
        completedUnits: number;
        totalUnits: number;
        completedLessons: number;
        totalLessons: number;
    };
};

export async function getCourseWithProgress(
    courseId: number,
    userId: string
): Promise<CourseWithProgress | null> {
    // Get the course
    const courseData = await db.query.course.findFirst({
        where: eq(course.id, courseId),
        with: {
            units: {
                with: {
                    lessons: true
                }
            },
            userProgress: {
                where: eq(userCourseProgress.userId, userId)
            }
        }
    });

    if (!courseData) return null;

    // Get unit progress
    const unitProgressData = await db.query.userUnitProgress.findMany({
        where: and(
            eq(userUnitProgress.userId, userId),
            eq(userUnitProgress.unitId, courseData.units[0].id)
        ),
        with: {
            unit: true
        }
    });

    // Get lesson progress
    const lessonProgressData = await db.query.userLessonProgress.findMany({
        where: and(
            eq(userLessonProgress.userId, userId),
            eq(userLessonProgress.lessonId, courseData.units[0].lessons[0].id)
        ),
        with: {
            lesson: true
        }
    });

    // Calculate progress statistics
    const totalUnits = courseData.units.length;
    const completedUnits = unitProgressData.filter(
        (progress: typeof userUnitProgress.$inferSelect) => progress.status === "completed"
    ).length;

    const totalLessons = courseData.units.reduce(
        (acc: number, unit: typeof unit.$inferSelect) => acc + unit.lessons.length,
        0
    );
    const completedLessons = lessonProgressData.filter(
        (progress: typeof userLessonProgress.$inferSelect) => progress.status === "completed"
    ).length;

    return {
        course: courseData,
        progress: {
            courseProgress: courseData.userProgress[0] ?? null,
            unitProgress: unitProgressData,
            lessonProgress: lessonProgressData,
            completedUnits,
            totalUnits,
            completedLessons,
            totalLessons
        }
    };
}

export async function updateCourseProgress(
    courseId: number,
    userId: string,
    data: {
        status?: typeof userCourseProgress.$inferSelect["status"];
        lastUnitId?: number;
        lastLessonId?: number;
        timeSpentMinutes?: number;
    }
) {
    const existingProgress = await db.query.userCourseProgress.findFirst({
        where: and(
            eq(userCourseProgress.userId, userId),
            eq(userCourseProgress.courseId, courseId)
        )
    });

    if (existingProgress) {
        return await db
            .update(userCourseProgress)
            .set({
                ...data,
                lastAccessedAt: new Date(),
                updatedAt: new Date()
            })
            .where(eq(userCourseProgress.id, existingProgress.id));
    }

    return await db.insert(userCourseProgress).values({
        userId,
        courseId,
        status: data.status ?? "not_started",
        lastUnitId: data.lastUnitId,
        lastLessonId: data.lastLessonId,
        timeSpentMinutes: data.timeSpentMinutes ?? 0,
        lastAccessedAt: new Date()
    });
} 