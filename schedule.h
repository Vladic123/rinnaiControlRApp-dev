/** schedule.h @file

   written by Marc Singer
   28 Jul 2020

   Copyright (C) 2020 Marc Singer

   -----------
   DESCRIPTION
   -----------

*/

#if !defined (SCHEDULE_H_INCLUDED)
#    define   SCHEDULE_H_INCLUDED

/* ----- Includes */

#include <vector>
#include <algorithm>
#include <string>
#include <cstring>
#include <functional>


/* ----- Macros */

/* ----- Types */

namespace Rinnai {

  /** structure to hold a list of schedule entries or intervals.  Each
      entry is a 16 bit value where the low four bits are the duration
      in 15 minute increments (0 indicates 15 minutes), and the upper
      12 bits are the start of the interval, beginning with 0 at
      midnight on Sunday, in 15 minute steps.  E.g. 0x0011 is 12:15am
      on Sunday for 30 minutes. */
  struct Schedule {
    std::vector<uint16_t> entries_;
    Schedule () = default;
    Schedule (const char* sz) { deserialize (sz); }
    Schedule (const std::string& s) { deserialize (s); }

    size_t size () const {
      return entries_.size (); }

    void sort () {
      std::sort (entries_.begin (), entries_.end ()); }

    /** compare two schedules for equivalence.  The schedules must be
        sorted or already known to be in the same order. */
    bool operator== (const Schedule& o) const {
      if (entries_.size () != o.entries_.size ())
        return false;
      return std::equal (entries_.begin (), entries_.end (),
                         o.entries_.begin ()); }

    bool operator != (const Schedule& o) const {
      return !operator== (o); }

    /** returns true of the start time of the given interval is
        identified within the schedule. */
    bool contains (uint16_t v) const {
      for (auto interval : entries_)
        if (contains (interval, v))
          return true;
      return false; }

    /** contains return true if the give day and time are identified
        within the scehdule. */
    bool contains (int day, int hour, int minute) const {
      int v = as_interval (day, hour, minute, 0);
      if (v < 0)
        return false;
      return contains (v); }

  protected:
    /** helper function to add a hex digit to the interval value.
        The return value is < 0 if the value is invalid. */
    static int add_hex_value (int v, char b) {
      if (v < 0)
        return v;
      if (!isxdigit (b))
        return -1;
      b -= '0';
      if (b > 9)
        b = ((b | 0x20) + 10) - ('a' - '0');
      v = (v << 4) + b;
      return v; }

    /** helper function to determine if moment resized within the
        given interval.  The duration of moment is ignored.  The
        return value is true if moment is within the interval.  Note
        that an interval of 10:00+15min does not include 10:15. */
    static bool contains (uint16_t interval, uint16_t moment) {
      if (moment < (interval & ~0xf))
        return false;
      /* Note that a duration of zero is 15 minutes, so the inequality
         is really checking for >= interval + duration. */
      if ((moment & ~0xf) > (interval & ~0xf) + ((interval & 0xf) << 4))
        return false;
      return true;
    }

  public:
    /** return interval value if a valid interval may be composed from
        the arguments.  The return value is <0 if there is an error in
        the parameters.  A valid interval may be composed from a given
        day of the week (0, Sun), hour (12, noon), minute, and
        duration.  If the given schedule entry is invalid, the
        function returns -1.  The duration is permitted to be zero
        which is silently promoted to 15 minutes. */
    static int as_interval (int day, int hour, int minute, int duration) {
      if (day < 0 || day >= 7)
        return -1;
      if (hour < 0 || hour > 23)
        return -1;
      if (minute < 0 || minute >= 60 || !!(minute%15))
        return -1;
      if (duration < 0 || duration > 16*15 || !!(duration%15))
        return -1;
      if (duration == 0)
        duration = 15;
      uint16_t v
        = ((day*(24*4) + hour*4 + minute/15) << 4)
        | ((duration/15) - 1);
      return v;
    }

    /** import schedule from ASCII string of hexadecimal digits.  The
        input must be an even number of shorts (16 bit values) which
        means the length must be a multiple of four.  The return value
        is <0 on error, either length or parsing error.  The return
        value is the number of intervals imported if it is positive or
        zero.  The arguments to the function must be compatible,
        forward iterators that point to a character convertible type.
        The data are imported in MSB order where the string "20e6" is
        the hexadecimal value 0x20e6. */
    template<typename iterator_> int deserialize (iterator_ b, iterator_ e) {
      static_assert (sizeof (*b) == 1,"");
      entries_.clear ();
      if ((e - b) & 3)          /* Verify even multiple of shorts */
        return -1;
      while (b != e) {
        int v = 0;
        v = add_hex_value (v, *b++);
        v = add_hex_value (v, *b++);
        v = add_hex_value (v, *b++);
        v = add_hex_value (v, *b++);
        if (v < 0)
          return -1;
        entries_.push_back (v);
      }
      return entries_.size (); }

    int deserialize (const char* sz) {
      return deserialize (sz, sz + strlen (sz)); }
    int deserialize (const std::string& s) {
      return deserialize (s.begin (), s.end ()); }

    /** helper function to emit each of the schedule entries as a
        hexadecimal string of correct length.  The functor receives
        each converted entry. */
    void serialize (std::function<void(const char*)> f) {
      for (auto v : entries_) {
        char sz[5];
        snprintf (sz, sizeof (sz), "%04x", v);
        f (sz);
      } }

    /** enumerate the schedule entries breaking out the day of the
        week (0, Sun), hour of the day (12, noon), minute of the
        hour, and duration in minutes. */
    void enumerate (std::function<void(uint16_t interval)> f) {
      for (auto v : entries_) {
        f (v); } }

    /** enumerate the schedule entries breaking out the day of the
        week (0, Sun), hour of the day (12, noon), minute of the
        hour, and duration in minutes. */
    void enumerate (std::function<void(int day, int hour,
                                       int minute, int duration)> f) {
      for (auto v : entries_) {
        int day = (v >> 4)/(24*4);
        int time = (v >> 4)%(24*4) * 15;
        int duration = ((v & 0xf) + 1) * 15;
        f (day, time/60, time%60, duration); } }

    /** add an entry to the schedule.  If the given schedule entry is
        invalid, the function returns -1.  Otherwise it returns 0.
        The function does not check for overlapping entries or
        redundant entries. */
    int insert (int day, int hour, int minute, int duration) {
      auto v = as_interval (day, hour, minute, duration);
      if (v < 0)
        return -1;
      entries_.push_back (v);
      return 0; }

  };

}

/* ----- Globals */

/* ----- Prototypes */

#if defined (CONFIG_TEST_SCHEDULE)

/* Test fixture for schedules.  These are some simple tests to make
   sure the data structure faithfully reflects the intention of the
   schedule. */

#include <assert.h>

using namespace Rinnai;

const char* describe (uint16_t v, char* sz, size_t cb) {
  int day = (v >> 4)/(24*4);
  int time = (v >> 4)%(24*4) * 15;
  int duration = ((v & 0xf) + 1) * 15;
  *sz = 0;
  if (day < 0 || day >=7)
    day = 0;
  snprintf (sz, cb, "%s %2d:%02d %d min",
            &"Sun\0Mon\0Tue\0Wed\0Thu\0Fri\0Sat"[day*4],
            time/60, time%60, duration);
  return sz;
}

int main (int argc, const char** argv) {

  Schedule s;				assert (s.size () == 0);

  s.insert (1, 10, 30, 45);		assert (s.size () == 1);
  s.insert (-1, 10, 30, 45);		assert (s.size () == 1);
  s.insert (7, 10, 30, 45);		assert (s.size () == 1);
  s.insert (1, -1, 30, 45);		assert (s.size () == 1);
  s.insert (1, 24, 30, 45);		assert (s.size () == 1);
  s.insert (1, 10, 31, 45);		assert (s.size () == 1);
  s.insert (1, 10, -1, 45);		assert (s.size () == 1);
  s.insert (1, 10, 60, 45);		assert (s.size () == 1);
  s.insert (1, 10, 30, 43);		assert (s.size () == 1);
  s.insert (1, 10, 30, -1);		assert (s.size () == 1);
  s.insert (1, 10, 30, 4*60 + 15);	assert (s.size () == 1);

  s.enumerate ([](uint16_t interval) {
      char sz[80];
      printf ("# %04x -- %s\n",
              interval, describe (interval, sz, sizeof (sz))); });

  s.enumerate ([](int day, int hour, int minute, int duration) {
      assert (day == 1);
      assert (hour == 10);
      assert (minute == 30);
      assert (duration == 45);
      printf ("# %d %d %d %d\n", day, hour, minute, duration); });

  assert (s.contains (1, 10, 30));
  assert (s.contains (1, 10, 45));
  assert (s.contains (1, 11, 00));
  assert (!s.contains (1, 11, 15));
  assert (!s.contains (1, 10, 15));

  s.insert (0, 9, 15, 30);
  s.insert (2, 9, 15, 30);
  s.insert (6, 9, 15, 30);
  s.insert (6, 17, 15, 60);
  assert (s.size () == 5);

  {
    int sum = 0;
    s.enumerate ([&](uint16_t interval) {
        sum += interval; });
    assert (sum == 0x67e8);
  }

  Schedule t = s;

  assert (s == t);
  s.sort ();
  assert (s != t);

  {
    int sum = 0;
    s.enumerate ([&](uint16_t interval) {
        sum += interval; });
    assert (sum == 0x67e8);
  }

  s.enumerate ([](uint16_t interval) {
      char sz[80];
      printf ("# %04x -- %s\n",
              interval, describe (interval, sz, sizeof (sz))); });

  std::string ex;
  s.serialize ([&](const char* sz) {
      ex.append (sz); });

  printf ("# %s\n", ex.c_str ());

  Schedule u (ex);
  assert (s == u);

  u.deserialize ("xxxx");
  assert (u.size () == 0);
  u.deserialize ("0000");
  assert (u.size () == 1);
  u.deserialize ("00000");
  assert (u.size () == 0);
  u.deserialize ("0A8D");
  assert (u.size () == 1);
}

#endif


#endif  /* SCHEDULE_H_INCLUDED */
