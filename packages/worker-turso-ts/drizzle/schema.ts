import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';


export const userTable = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  hashed_password: text("hashed_password").notNull(),
});

export const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull()
});

export const countries = sqliteTable('countries', {
    id: integer('id').primaryKey(),
    name: text('name'),
  }, (countries) => ({
    nameIdx: uniqueIndex('nameIdx').on(countries.name),
  })
);

export const cities = sqliteTable('cities', {
  id: integer('id').primaryKey(),
  name: text('name'),
  countryId: integer('country_id').references(() => countries.id),
})