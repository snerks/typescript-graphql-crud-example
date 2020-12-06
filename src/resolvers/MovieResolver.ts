import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Movie } from "../entity/Movie";

@InputType()
class MovieInput {
    @Field()
    title: string;

    @Field(() => Int)
    minutes: number;
}

@InputType()
class MovieUpdateInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  minutes?: number;
}

@Resolver()
export class MovieResolver {
    @Mutation(() => Movie)
    async createMovie(@Arg("options", () => MovieInput) options: MovieInput) {

        const movie = await Movie.create(options).save();

        return movie;
    }

    @Mutation(() => Boolean)
    async updateMovie(
      @Arg("id", () => Int) id: number,
      @Arg("input", () => MovieUpdateInput) input: MovieUpdateInput
    ) {
      const existingMovies = await Movie.findByIds([id]);

      if (existingMovies.length > 0) {
        await Movie.update({ id }, input);
        return true;
      }

      return false;
    }
  
    @Mutation(() => Boolean)
    async deleteMovie(@Arg("id", () => Int) id: number) {
        const existingMovies = await Movie.findByIds([id]);

        if (existingMovies.length > 0) {
            await Movie.delete({ id });
            return true;
        }

        return false;
    }

    @Query(() => [Movie])
    async movies() {
        return  await Movie.find();
    }
}